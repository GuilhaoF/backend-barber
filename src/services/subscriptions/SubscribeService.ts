import prismaClient from "../../prisma";
import Stripe from 'stripe'

interface SubscribeRequest {
    user_id: string;
}

class SubscribeService {
    async execute({user_id}: SubscribeRequest) {
        const stripe = new Stripe(
            process.env.STRIPE_API_KEY,
            {
                apiVersion: '2022-08-01',
                appInfo: {
                    name: 'BarberPro',
                    version: '1'
                }
            }
        )
        //buscar user e cadastrar ele no stripe  caso nao tenha cadastro

        const findUser = await prismaClient.user.findFirst({
            where: {
                id: user_id
            }
        })
        //pegando o stripe customer_id do user_id do user passado
        let customerId = findUser.stripe_customer_id

        if (!customerId) {
            //caso nao tenha iremos criar o cliente no stripe
            const stripeCustomer = await stripe.customers.create({
                email: findUser.email
            })
            //depois de criado coloca no banco de dados
            await prismaClient.user.update({
                where: {
                    id: user_id
                },
                data: {
                    stripe_customer_id: stripeCustomer.id
                }
            })
            customerId = stripeCustomer.id
        }
        //inicializar checkout de pagamento
        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: "required",
            line_items: [
                {price: process.env.STRIPE_PRICE, quantity: 1}
            ],
            mode:'subscription',
            allow_promotion_codes:true,
            success_url:process.env.STRIPE_SUCCESS_URL,
            cancel_url:process.env.STRIPE_CANCEL_URL,
        })
        return { sessionId: stripeCheckoutSession.id }
    }
}

export {SubscribeService}