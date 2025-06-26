/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("monthly_task_progress", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()")); // Primary key
    table.uuid("task_ref_id")
      .notNullable()
      .references("id")
      .inTable("monthly_task_ref") // Foreign Key Reference
      .onDelete("CASCADE"); // If parent is deleted, delete child rows automatically
    table.integer("progress").notNullable();
    table.integer("target").notNullable();
    table.date("date").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  });
};


exports.down = function(knex) {
  return knex.schema.dropTable("monthly_task_progress");
};
