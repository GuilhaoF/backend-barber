import prismaClient from "../../prisma";

interface HaircutRequest{
    user_id: string;
    name: string;
    price: number;
}

class CreateHaircutService{
    async execute({user_id,name,price}:HaircutRequest) {
        if(!name || !price){
            throw new Error("error")
        }
        //pegando quantos cortes desse  usuario passado
        const myHaircuts = await prismaClient.haircut.count({
            where: {
                user_id: user_id,
            }
        })
        //trazendo as informacoes desse usuario e status da sua subscriptions para validacoes
        const user = await prismaClient.user.findFirst({
            where: {
                id: user_id
            },
            include: {
                subscriptions:true
            }
        })
        if(myHaircuts >= 4 && user?.subscriptions?.status !== 'active'){
            throw new Error("Not autorized")
        }

        //criando o modelo de corte
        const haircut = await prismaClient.haircut.create({
            data:{
                name:name,
                price: price,
                user_id:user_id
            }
        })
        return haircut

    }
}
export {CreateHaircutService}