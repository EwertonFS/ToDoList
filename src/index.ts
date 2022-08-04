import express, { Express, Request, response, Response } from "express";
import cors from "cors";
import { accounts } from "./accounts";

const app: Express = express();

app.use(express.json());
app.use(cors());

//criando end points que serao acessados pelo metodo post

app.post("/users/create", (req: Request, res: Response) => {
  try {
    //consultar ou alterar a base de dados
    const { name, CPF, dateOfBirthAsString } = req.body;
    //tratar essa data nascimento transformar date para string
    const [day, month, year] = dateOfBirthAsString.split("/"); //01/01/2020

    const dateOfBirth: Date = new Date(`${year}-${month}-${day}`);

    //validar idade

    const ageInMilisseconds: number = Date.now() - dateOfBirth.getTime();//ou como new Date().getTime()

    const ageInYears: number = ageInMilisseconds / 1000 / 60 / 60 / 24 / 365;

    //validar as entradas da requisição

    if (ageInYears < 18) {
     res.statusCode = 406
     throw new Error("idade deve ser maior ou igual a 18 anos");
     
    }

    //quando o objeto é igual ao valor podemos decalar de forma abreviada se não seria name:name, e assim sucessivamente famosa destruração
    accounts.push({
      name,
      CPF,
      dateOfBirth,
      balance: 0,
      statement: [],
    });
    //validar os resultados da consulta acessados
    //ennviar a resposta
    res.status(201).send("Conta criada com sucesso !");
  } catch (error: any) {
    res.send(error.message);
  }
});

app.get("/users/all", (req: Request, res: Response) => {
  try {
    if (!accounts.length) {
      //se [] estiver vazio  de zero
      res.statusCode = 404;
      throw new Error("nenhuma conta encontrada");
    }

    res.status(200).send(accounts);
  } catch (error: any) {
    res.send(error.message);
  }
});

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});
