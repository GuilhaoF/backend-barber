import prismaClient from "../../prisma"
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

interface AuthUserRequest {
    email: string
    password: string
}

class AuthUserService {
    async execute({ email, password }: AuthUserRequest) {
        
        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            },
            //incluindo a subscriptions que usuario tiver 
            include: {
                subscriptions: true
            }
        })
        if (!user) {
            throw new Error('Email/Password incorreto')
        }
        //comparando senha do usuario com a cadastrada
        const passwordMatch = await compare(password, user?.password)

        //verificando se a senha esta diferente da cadastrada
        if (!passwordMatch) {
            throw new Error('Email/password incorreto')
        }
        const token = sign(
            {
                name: user.name,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: '30d'
            }
        )

        return{
            id: user?.id,
            name: user?.name,
            email: user?.email,
            endereco: user?.endereco,
            token: token,
            //trazendo as subcriptions e as informacoes(id e status)
            subscriptions: user.subscriptions?{
                id:user?.subscriptions?.id,
                status: user?.subscriptions?.status
            } : null
        }
    }
}

export {AuthUserService}