
import knex from "../database/connection";

async function middleware(token = {}) {
  let status;
  const validToken = await knex("token").where("token", token).first();

  if (validToken) status = 200;
  else status = 401;

  return status;
}

export default middleware
