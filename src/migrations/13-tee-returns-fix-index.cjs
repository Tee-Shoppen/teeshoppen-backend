module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_return_line_items_unique
      ON "returns"."return_line_items" ("return_id", "order_line_item_id");
    `);
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS "returns"."idx_return_line_items_unique";
    `);
  },
};
