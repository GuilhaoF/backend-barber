import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken"; //verifica o token web


interface Payload {
    sub: string
}

export function isAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction

) {
    //pegando o token pelos headers
    const authToken = request.headers.authorization

    //verificando se ta recebendo token
    if (!authToken) {
        return response.status(401).end() //nao pode prosseguir
    }
    //ignorando primeira posicao do texto(bearer)
    const [, token] = authToken.split(" ")

    try {
        //verificando o token e a security
        const {sub} = verify(
            token, 
            process.env.JWT_SECRET
            ) as Payload

        request.user_id = sub;

        return next();

    }catch (err) {
        return response.status(401).end()
    }


}