import { Request, Response } from "express";
import knex from "../../database/connection";
import middleware from '../../middlewares/auth'
class Users {
  async index(req: Request, res: Response) {
    try {
      const token = req.headers["token"];

      if ((await middleware(token)) === 401) {
        return res.status(401).json({
          message: "Não autorizado!",
        });
      }

      let users = await knex("users").select("*");
      users.forEach((user) => {
        user.password = undefined;
      });

      return res.status(200).json(users);
    } catch (error) {
      return res.status(error.status).json({
        message: "Ocorreu um erro!",
      });
    }
  }

  async show(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const token = req.headers["token"];

      if ((await middleware(token)) === 401) {
        return res.status(401).json({
          message: "Não autorizado!",
        });
      }

      const user = await knex("users").where("id", id).first();
      user.password = undefined;

      return res.status(200).json(user);
    } catch (error) {
      return res.status(error.status).json({
        message: "Ocorreu um erro!",
      });
    }
  }
}

export default Users;
