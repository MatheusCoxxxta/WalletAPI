import { Request, Response } from "express";
import knex from "../../database/connection";
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

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

      const token = await generateToken({ id: user });

      await knex("token").insert({
        token,
        user_id: user,
      });

      const userData = await knex("users").where("id", user).first();
      userData.password = undefined;
      return res.status(200).json({
        user: userData,
        token,
      });
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
        const token = await generateToken({ id: userData.id });

        await knex("token").where("user_id", userData.id).update({
          token,
        });

        userData.password = undefined;

        return res.status(200).json({
          user: userData,
          token,
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Ocorreu um erro!",
      });
    }
  }
}

export default Auth;
