import { Request,Response } from "express";
import {UpdateUserService} from '../../services/user/UpdateUserService'


class UpdateUserController{
    async handle(request: Request, response: Response){
        //pegando dados que vao ser atualizados
        const {name,endereco} = request.body
        //pegando id do usuario ja logado para as atualizacoes
        const user_id = request.user_id

        //chando o service 
        const updateUser = new UpdateUserService()

        const user = await updateUser.execute({
            user_id,
            name,
            endereco
        })
        return response.json(user)


    }
}

export {UpdateUserController}