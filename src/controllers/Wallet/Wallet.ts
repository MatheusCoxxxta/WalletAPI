import { Request, Response } from "express";
import knex from "../../database/connection";
import middleware from "../../middlewares/auth";

class Wallet {
  async show(req: Request, res: Response) {
    const token = req.headers["token"];
    const user_id = req.headers["id"];

    if ((await middleware(token)) === 401) {
      return res.status(401).json({
        message: "Não autorizado!",
      });
    }

    try {
      const wallet = await knex("wallet").where("id", user_id).first();
      return res.status(200).json(wallet);
    } catch (error) {
      return res.status(500).send("Ocorreu um erro!");
    }
  }

  async store(req: Request, res: Response) {
    const { total } = req.body;
    const token = req.headers["token"];
    const user_id = req.headers["id"];

    if ((await middleware(token)) === 401) {
      return res.status(401).json({
        message: "Não autorizado!",
      });
    }

    try {
      const userWallet = await knex("wallet").where("user_id", user_id).first();

      if (userWallet) {
        return res
          .status(400)
          .json({ message: "Esse usuário já possui carteira!" });
      }

      const wallet = await knex("wallet").insert({
        user_id,
        total,
      });

      const walletData = await knex("wallet").where("id", wallet).first();

      return res.status(200).json(walletData);
    } catch (error) {
      return res.status(500).send("Ocorreu um erro!");
    }
  }

  async update(req: Request, res: Response) {
    const { spent, earn } = req.body;
    const token = req.headers["token"];
    const user_id = req.headers["id"];

    if ((await middleware(token)) === 401) {
      return res.status(401).json({
        message: "Não autorizado!",
      });
    }

    try {
      const userWallet = await knex("wallet").where("user_id", user_id).first();

      if (!userWallet) {
        return res
          .status(400)
          .json({ message: "Esse usuário não possui carteira!" });
      }

      let total = 0;

      if (earn) {
        total = userWallet.total + earn;
      } else if (spent) {
        total = userWallet.total - spent;
      }

      const wallet = await knex("wallet")
        .where("id", userWallet.id)
        .update({ total });

      const walletData = await knex("wallet").where("id", wallet).first();
      return res.status(200).json(walletData);
    } catch (error) {
      return res.status(500).send("Ocorreu um erro!");
    }
  }
}

export default Wallet;
