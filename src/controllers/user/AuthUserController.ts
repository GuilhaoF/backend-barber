import { Request,Response } from "express";
import {AuthUserService} from "../../services/user/AuthUserService"



class AuthUserController{
    async handle(request: Request, response: Response){
        //dados a receber da requisicao
        const {email,password} = request.body

        //chamando o service de auth
        const authUserService = new AuthUserService()

        //executando o service
        const session = await authUserService.execute({
            email, password
        })
        //retorna dados da sessao
        return response.json(session)
    }
}
export {AuthUserController}