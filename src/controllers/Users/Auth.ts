import { Request, Response } from "express";
import knex from "../../database/connection";

class Auth {
  async store(req: Request, res: Response) {
    try {
      const data = req.body;

      if (!data.name || !data.email || !data.password) {
        return res.status(400).json({
          message: "Não foram enviados todos os dados!",
        });
      }

      const users = await knex("users").where("email", data.email).first();

      if (users) {
        return res.status(400).json({
          message: "Email já cadastrado",
        });
      }

      const user = await knex("users").insert(data);
      const userData = await knex("users").where("id", user).first();
      userData.password = undefined
      return res.status(200).json(userData);
    } catch (error) {
      return res.status(500).json({
        message: "Ocorreu um erro!",
      });
    }
  }

  async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const userData = await knex("users").where("email", email).first();

      if (userData.password !== password) {
        return res.status(401).json({
          message: "Não autorizado!",
        });
      } else if (userData.password === password) {
        userData.password = undefined
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
