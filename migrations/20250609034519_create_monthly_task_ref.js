/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("monthly_task_ref", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()")); // Primary key
    table.string("user_id").notNullable(); // Foreign key reference to users
    table.string("name").notNullable();
    table.string("pillar").notNullable();
    table.string("type").notNullable();
    table.integer("target").notNullable();
    table.string("link").nullable();
    table.text("description").nullable();
    table.string("image_url").nullable();
    table.date("start_date").notNullable();
    table.date("end_date").nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("monthly_task_ref");
};
