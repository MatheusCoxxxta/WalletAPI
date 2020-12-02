import express from "express";
import Users from "./controllers/Users/Users";
import Auth from "./controllers/Users/Auth";

import Wallet from "./controllers/Wallet/Wallet";
import Log from "./controllers/Wallet/Log";

const routes = express.Router();

const usersController = new Users();
const authController = new Auth();
const walletController = new Wallet();
const logController = new Log();

routes.get("/", (req, res) => {
  res.json({ message: "Bem vindo ao Wallet API!" });
});

routes.get("/users", usersController.index);
routes.get("/users/:id", usersController.show);

routes.post("/signUp", authController.store);
routes.post("/auth", authController.signIn);

routes.get("/wallet", walletController.show);
routes.post("/wallet", walletController.store);
routes.put("/wallet", walletController.update);

routes.get("/log", logController.show);

export default routes;
