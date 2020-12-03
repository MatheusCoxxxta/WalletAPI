import knex from "../database/connection";

async function middleware(token = {}) {
  try {
    let status;
    const validToken = await knex("token").where("token", token).first();

    if (validToken) status = 200;
    else status = 401;

    return status;
  } catch (error) {
    console.log(error)
  }

}


export default middleware
