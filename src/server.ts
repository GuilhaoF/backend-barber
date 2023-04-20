import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import 'express-async-errors'
import { router } from './routes'

const app = express();

app.use((req, res, next) => {
  /* rota webhooks em outro formato */
  if (req.originalUrl === '/webhooks') {
    next();
  } else {
    /* entender formato json */
    express.json()(req, res, next)
  }
});


//ativando cors
app.use(cors());

//usar o sistema de rotas
app.use(router)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

  if (err instanceof Error) {
    return res.status(400).json({
      error: err.message
    })
  }
  return res.status(500).json({
    status: 'Error',
    message: 'Internal Server Error'
  })

})

app.listen(3000, () => console.log("Servidor BarberPro rodando !"))