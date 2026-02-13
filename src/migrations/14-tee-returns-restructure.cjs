module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query('BEGIN;')
      .then(() => queryInterface.sequelize.query(`
        DROP TABLE IF EXISTS "returns"."return_line_items" CASCADE;
      `))
      .then(() => queryInterface.sequelize.query(`
        DROP TABLE IF EXISTS "returns"."returns" CASCADE;
      `))
      .then(() => queryInterface.sequelize.query(`
        CREATE SCHEMA IF NOT EXISTS "returns";
      `))
      .then(() => queryInterface.sequelize.query(`
        CREATE TABLE "returns"."return_line_items" (
          "id" BIGSERIAL PRIMARY KEY,
          "order_id" BIGINT NOT NULL,
          "order_line_item_id" BIGINT NOT NULL,
          "order_number" TEXT NOT NULL,
          "webshop" TEXT NOT NULL,
          "sku" TEXT NOT NULL,
          "mpn" TEXT,
          "quantity_returned" INTEGER NOT NULL,
          "return_reason" TEXT,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );
      `))
      .then(() => queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_return_line_items_sku
        ON "returns"."return_line_items"(sku);
      `))
      .then(() => queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_return_line_items_order_line_item_id
        ON "returns"."return_line_items"(order_line_item_id);
      `))
      .then(() => queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_return_line_items_order_id
        ON "returns"."return_line_items"(order_id);
      `))
      .then(() => queryInterface.sequelize.query('COMMIT;'))
      .catch((err) => {
        queryInterface.sequelize.query('ROLLBACK;');
        console.log(err);
        throw err;
      });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "returns"."return_line_items";
    `);
  },
};
