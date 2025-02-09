exports.up = function (knex) {
  return knex.schema.createTable("daily_task_ref", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()")); // Primary key
    table.uuid("user_id").notNullable(); // Foreign key reference to users
    table.string("name").notNullable();
    table.string("pillar").notNullable();
    table.string("type").notNullable();
    table.specificType("target", "INTEGER[7]").notNullable(); // Array of 7 integers
    table.string("link").nullable();
    table.text("description").nullable();
    table.date("start_date").notNullable();
    table.date("end_date").nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("daily_task_ref");
};
