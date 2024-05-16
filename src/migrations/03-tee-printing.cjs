module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query('BEGIN;')
    .then(() => queryInterface.sequelize.query(
      'CREATE SCHEMA IF NOT EXISTS "printings";',
    ))
      .then(() => queryInterface.sequelize.query(
        'CREATE TABLE "printings"."printings" (' +
        '"id" VARCHAR(255) PRIMARY KEY NOT NULL, ' +
        '"link" VARCHAR(255) NOT NULL' +
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
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "printing"."printings";');
  },
};
