module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query('BEGIN;')
      .then(() => queryInterface.sequelize.query(
        'CREATE SCHEMA IF NOT EXISTS "returns";'
      ))
      .then(() => queryInterface.sequelize.query(
        'CREATE TABLE "returns"."returns" ('
        + '"id" BIGINT PRIMARY KEY NOT NULL, '
        + '"order_id" BIGINT NOT NULL, '
        + '"order_number" TEXT NOT NULL, '
        + '"webshop" TEXT NOT NULL, '
        + '"country" TEXT, '
        + '"created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), '
        + '"updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()'
        + ');'
      ))
      .then(() => queryInterface.sequelize.query(
        'CREATE TABLE "returns"."return_line_items" ('
        + '"id" BIGSERIAL PRIMARY KEY, '
        + '"return_id" BIGINT NOT NULL REFERENCES "returns"."returns"("id") ON DELETE CASCADE ON UPDATE CASCADE, '
        + '"order_line_item_id" BIGINT NOT NULL REFERENCES "orders"."order_line_items"("id") ON DELETE CASCADE ON UPDATE CASCADE, '
        + '"sku" TEXT NOT NULL, '
        + '"mpn" TEXT, '
        + '"quantity_returned" INTEGER NOT NULL, '
        + '"return_reason" TEXT, '
        + '"created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()'
        + ');'
      ))
      .then(() => queryInterface.sequelize.query(
        'CREATE INDEX IF NOT EXISTS idx_return_line_items_sku ON "returns"."return_line_items"(sku);'
      ))
      .then(() => queryInterface.sequelize.query(
        'CREATE INDEX IF NOT EXISTS idx_return_line_items_order_line_item_id ON "returns"."return_line_items"(order_line_item_id);'
      ))
      .then(() => queryInterface.sequelize.query('COMMIT;'))
      .catch((err) => {
        queryInterface.sequelize.query('ROLLBACK;');
        console.log(err);
        throw err;
      });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "returns"."return_line_items"');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "returns"."returns"');
    await queryInterface.sequelize.query('DROP SCHEMA IF EXISTS "returns"');
  },
};
