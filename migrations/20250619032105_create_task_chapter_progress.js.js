exports.up = function(knex) {
  return knex.schema.createTable('task_chapter_progress', (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid('task_progress_id').references('id');
    table.uuid('task_chapter_ref_id').references('id').inTable('task_chapter_ref');
    table.integer('iteration').notNullable();
    table.boolean('status').defaultTo(false);
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('task_chapter_progress');
};
