import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("wallet", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users");
    table.decimal("total", 12, 2);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("wallet");
}
