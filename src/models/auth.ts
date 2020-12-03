import knex from "../database/connection";

async function getUser(token = {}) {
  try {
    const validToken = await knex("token").where("token", token).first();
    const user_id = await validToken.user_id

    return user_id;
  } catch (error) {
    console.log(error)
  }
}

export default getUser
