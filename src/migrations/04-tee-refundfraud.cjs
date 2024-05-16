module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query('BEGIN;')
    .then(() => queryInterface.sequelize.query(
      'CREATE SCHEMA IF NOT EXISTS "refund_fraud_monitorings";',
    ))
      .then(() => queryInterface.sequelize.query(
        'CREATE TABLE "refund_fraud_monitorings"."refund_fraud_monitorings" (' +
        '"id" VARCHAR(255) PRIMARY KEY NOT NULL, ' +
        '"status" VARCHAR(255) NOT NULL, ' +
        '"link" VARCHAR(255) NOT NULL, ' +
        '"store" VARCHAR(255) NOT NULL, ' +
        '"refund_of" VARCHAR(255) NOT NULL, ' +
        '"amount_refunded" DOUBLE PRECISION NOT NULL, ' +  // Assuming high precision is needed
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
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "refund_fraud_monitorings"."refund_fraud_monitorings";');
  },
};
