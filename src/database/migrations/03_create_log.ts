import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("log", (table) => {
    table.increments("id").primary();
    table.enu("type", ["earn", "spent"]).notNullable();
    table.decimal("value", 12, 2).notNullable();
    table.string("description").notNullable();
    table.integer("wallet_id").notNullable().references("id").inTable("wallet");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("log");
}
