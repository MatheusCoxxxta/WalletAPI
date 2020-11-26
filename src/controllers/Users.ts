import { Request, Response } from "express";
import knex from "../database/connection";

class Users {
  async index(req: Request, res: Response) {
    try {
      const users = await knex("users").select("*");
      return res.status(200).json(users);
    } catch (error) {
      return res.status(error.status).json({
        message: "Ocorreu um erro!",
      });
    }
  }

  async show(req: Request, res: Response) {
    const id = req.params.id
    try {
      const user = await knex("users").where("id", id)
      return res.status(200).json(user);
    } catch (error) {
      return res.status(error.status).json({
        message: "Ocorreu um erro!",
      });
    }
  }
}

export default Users;
