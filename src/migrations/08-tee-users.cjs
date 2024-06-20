module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query('BEGIN;')
    .then(() => queryInterface.sequelize.query(
      'CREATE SCHEMA IF NOT EXISTS "users";',
    ))
      .then(() => queryInterface.sequelize.query(
        'CREATE TABLE "users"."users" (' +
        '"id" BIGINT PRIMARY KEY NOT NULL, ' +
        '"email" VARCHAR(255) NOT NULL, ' +
        '"password" VARCHAR(255) NOT NULL, ' +
        '"position" VARCHAR(255) NOT NULL ' +
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
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "users"."users";');
  },
};
