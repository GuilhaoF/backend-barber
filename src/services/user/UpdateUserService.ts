import prismaClient from "../../prisma";

interface UserRequest {
    user_id: string;
    name: string;
    endereco: string;
}

class UpdateUserService {
    async execute({ user_id, name, endereco }: UserRequest) {

        try {
            //verificando se usuario existe(primeiro que achar)
            const userAlreadyExists = await prismaClient.user.findFirst({
                where: {
                    id: user_id
                }
            })

            if(!userAlreadyExists) {
                throw new Error('User Not Exists')
            }
            //fazendo o update
            const userUpdated = await prismaClient.user.update({
                where: {
                    id: user_id
                },
                //dados
                data: {
                    name,
                    endereco
                },
                select: {
                    name:true,
                    email:true,
                    endereco:true
                }
            })
            return userUpdated

        }catch (err) {
            console.error(err)
            throw new Error("error updating user")
        }

    }
}
export { UpdateUserService}