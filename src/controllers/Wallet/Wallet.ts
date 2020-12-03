import { Request, Response } from "express";
import knex from "../../database/connection";
import middleware from "../../middlewares/auth";
import getUser from "../../models/auth";

class Wallet {
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
      const wallet = await knex("wallet").where("id", user_id).first();
      return res.status(200).json(wallet);
    } catch (error) {
      return res.status(500).send("Ocorreu um erro!");
    }
  }

  async store(req: Request, res: Response) {
    const { total } = req.body;
    const token = req.headers["token"];
    const user_id = await getUser(token)

    const validToken = await middleware(token)

    if (validToken === 401) {
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

      let data = {
        value: total,
        type: "earn",
        description: "Entrada inicial.",
        wallet_id: wallet,
      };

      const log = await knex("log").insert(data);


      const walletData = await knex("wallet").where("id", wallet).first();

      return res.status(200).json(walletData);
    } catch (error) {
      return res.status(500).send("Ocorreu um erro!");
    }
  }

  async update(req: Request, res: Response) {
    const { spent, earn, description } = req.body;
    const token = req.headers["token"];
    const user_id = await getUser(token)

    const validToken = await middleware(token)

    if (validToken === 401) {
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
      let data = {
        value: 0,
        type: "",
        description: "",
        wallet_id: 0,
      };

      if (earn) {
        total = userWallet.total + earn;
        data.value = earn;
        data.type = "earn";
      } else if (spent) {
        total = userWallet.total - spent;
        data.value = spent;
        data.type = "spent";
      }

      const wallet = await knex("wallet")
        .where("id", userWallet.id)
        .update({ total });

      (data.description = description), (data.wallet_id = userWallet.id);

      const log = await knex("log").insert(data);

      const logData = await knex("log").where("id", log).first();

      const walletData = await knex("wallet").where("id", wallet).first();
      return res.status(200).json({ walletData, logData });
    } catch (error) {
      return res.status(500).send("Ocorreu um erro!");
    }
  }
}

export default Wallet;
