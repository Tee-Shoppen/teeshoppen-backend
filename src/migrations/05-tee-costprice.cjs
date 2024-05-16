module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query('BEGIN;')
    .then(() => queryInterface.sequelize.query(
      'CREATE SCHEMA IF NOT EXISTS "cost_price_monitorings";',
    ))
      .then(() => queryInterface.sequelize.query(
        'CREATE TABLE "cost_price_monitorings"."cost_price_monitorings" (' +
        '"id" VARCHAR(255) PRIMARY KEY NOT NULL, ' +
        '"status" VARCHAR(255) NOT NULL, ' +
        '"link" VARCHAR(255) NOT NULL, ' +
        '"store" VARCHAR(255) NOT NULL, ' +
        '"variants" JSONB, ' + // Using JSONB for flexible variant data storage
        '"order_cost" DOUBLE PRECISION NOT NULL, ' +
        '"order_price" DOUBLE PRECISION NOT NULL, ' +
        '"created_at" TIMESTAMP NOT NULL' +
        ');'
      ))
    
      .then(() => queryInterface.sequelize.query('COMMIT;'))
      .catch((err) => {
        queryInterface.sequelize.query('ROLLBACK;');
        // eslint-disable-next-line no-console
        console.log(err);
        throw err;
      });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "cost_price_monitorings"."cost_price_monitorings";');
  },
};
