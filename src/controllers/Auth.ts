import { Request, Response } from "express";
import knex from "../database/connection";

class Auth {
  async store(req: Request, res: Response) {
    try {
      const data = req.body;

      const user = await knex("users").insert(data);
      const userData = await knex("users").where("id", user);
      return res.status(200).json(userData);
    } catch (error) {
      return res.status(500).json({
        message: "Ocorreu um erro!",
      });
    }
  }

  async signIn(req: Request, res: Response) {
    try {
      const { name, email } = req.body;

      const userData = await knex("users").where("email", email).first();

      if(userData.name !== name) {
        return res.status(401).json({
          message: "Não autorizado!",
        });
      }
      else if(userData.name === name) {
        return res.status(200).json(userData);
      }

    } catch (error) {
      return res.status(500).json({
        message: "Ocorreu um erro!",
      });
    }
  }
}

export default Auth;
