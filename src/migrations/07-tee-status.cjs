module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query('BEGIN;')
    .then(() => queryInterface.sequelize.query(
      'CREATE SCHEMA IF NOT EXISTS "statuses";',
    ))
      .then(() => queryInterface.sequelize.query(
        'CREATE TABLE "statuses"."statuses" (' +
        '"id" BIGINT PRIMARY KEY NOT NULL, ' +
        '"name" VARCHAR(255) NOT NULL ' +
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
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "statuses"."statuses";');
  },
};
