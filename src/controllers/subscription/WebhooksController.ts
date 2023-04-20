import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from '../../utils/stripe'
import { saveSubscription } from '../../utils/manageSubscription'

class WebhooksController {
    async handle(request: Request, response: Response) {
        /*pegando evento no corpo da requisicao*/
        let event: Stripe.Event = request.body

        /*pegando assinatura no header*/
        const signature = request.headers['stripe-signature']

        /*recebendo endpoint*/
        let endpointSecret = 'whsec_a877101859fc6d8f40a7e4acdcbd2672eb7d81c219edf852bbea7697137ed891'

        try {
            /*validar assinatura do webhook*/
            event = stripe.webhooks.constructEvent(request.body, signature, endpointSecret)
        }
        catch (err) {
            console.log(err.message)
            return response.status(400).send(`Webhook error : ${err.message}`)
        }
        /* Casos de Uso */
        switch (event.type) {
            case 'customer.subscription.deleted':
                const payment = event.data.object as Stripe.Subscription;

                await saveSubscription(
                    payment.id,
                    payment.customer.toString(),
                    false,
                    true
                )

                break;

            case 'customer.subscription.updated':
                const paymentIntent = event.data.object as Stripe.Subscription;

                await saveSubscription(
                    paymentIntent.id,
                    paymentIntent.customer.toString(),
                    false
                )
                break;

            case 'checkout.session.completed':
                const checkoutSession = event.data.object as Stripe.Checkout.Session;

                await saveSubscription(
                    checkoutSession.subscription.toString(),
                    checkoutSession.customer.toString(),
                    true,
                )
                break;
            default:
                console.log(`Evento Desconhecido ${event.type}`)
        }
    }
}
export { WebhooksController }