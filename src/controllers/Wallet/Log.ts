import { Request, Response } from "express";
import knex from "../../database/connection";
import middleware from "../../middlewares/auth";
import getUser from "../../models/auth";

class Log {
  async show(req: Request, res: Response) {
    const token = req.headers["token"];
    const user_id = await getUser(token)

    const validToken = await middleware(token)

    if (validToken === 401) {
      return res.status(401).json({
        message: "Não autorizado!",
      });
    }

    try {
      const wallet = await knex("wallet").where("user_id", user_id).first();

      const log = await knex("log").where("wallet_id", wallet.id);

      return res.status(200).json(log);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}

export default Log;
