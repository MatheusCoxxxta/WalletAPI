import express from "express";
import Users from './controllers/Users'
import Auth from './controllers/Auth'

const routes = express.Router();

const usersController = new Users()
const authController = new Auth()

routes.get("/", (req, res) => {
  res.json({ message: "Bem vindo ao Wallet API!" });
});

routes.get("/users", usersController.index);
routes.get("/users/:id", usersController.show);

routes.post("/users", authController.store);
routes.post("/auth", authController.signIn);


export default routes;
