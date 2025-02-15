exports.up = function (knex) {
  return knex.schema.createTable("daily_task_progress", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()")); // Primary Key
    table
      .uuid("daily_task_ref_id")
      .notNullable()
      .references("id")
      .inTable("daily_task_ref") // Foreign Key Reference
      .onDelete("CASCADE"); // If parent is deleted, delete child rows automatically
    table.uuid("user_id").notNullable();
    table.integer("daily_progress").notNullable();
    table.integer("daily_target").notNullable();
    table.date("date").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("daily_task_progress");
};
