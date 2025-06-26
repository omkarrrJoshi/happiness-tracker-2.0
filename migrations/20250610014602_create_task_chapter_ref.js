exports.up = function(knex) {
  return knex.schema.createTable("task_chapter_ref", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()")); // Primary key
    table.string("task_ref_id").notNullable();
    table.string("name").notNullable();
    table.string("target").notNullable();
    table.string("link").nullable();
    table.text("description").nullable();
    table.string("image_url").nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("task_chapter_ref");
};
