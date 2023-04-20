import {Request,Response} from 'express'
import { ListHaircutService } from '../../services/haircut/LIstHaircutService'


class ListHaircutController{
    async handle(request: Request, response: Response){
        const user_id = request.user_id
        //informando que status e' string
        const status = request.query.status as string

        const listHaircuts = new ListHaircutService()

        const haircuts = await listHaircuts.execute({
          user_id, status
        })
        return response.json(haircuts)
    }
}
export {ListHaircutController}