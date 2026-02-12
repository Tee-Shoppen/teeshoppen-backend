module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.sequelize
      .query('BEGIN;')
      .then(() =>
        queryInterface.sequelize.query(
          'ALTER TABLE "orders"."order_line_items" ADD COLUMN IF NOT EXISTS "sku" STRING;'
        )
      )
      .then(() => queryInterface.sequelize.query('COMMIT;'))
      .catch(async (err) => {
        await queryInterface.sequelize.query('ROLLBACK;');
        // eslint-disable-next-line no-console
        console.log(err);
        throw err;
      });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query(
      'ALTER TABLE "orders"."order_line_items" DROP COLUMN IF EXISTS "sku";'
    );
  },
};
