exports.up = function (knex) {
  return knex.schema.alterTable("daily_task_ref", (table) => {
    table.string("image_url").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("daily_task_ref", (table) => {
    table.dropColumn("image_url");
  });
};