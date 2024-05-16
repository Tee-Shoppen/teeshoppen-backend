module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query('BEGIN;')
    .then(() => queryInterface.sequelize.query(
      'CREATE SCHEMA IF NOT EXISTS "collections";',
    ))
      .then(() => queryInterface.sequelize.query(
        'CREATE TABLE "collections"."collections" (' +
        '"id" BIGINT PRIMARY KEY NOT NULL, ' +
        '"webshop" VARCHAR(255) NOT NULL, ' +
        '"handle" VARCHAR(255), ' +
        '"title" VARCHAR(255) NOT NULL, ' +
        '"updated_at" TIMESTAMP NOT NULL, ' +
        '"created_at" TIMESTAMP NOT NULL, ' +
        '"deleted_at" TIMESTAMP, ' +
        '"body_html" TEXT, ' +  // Assuming bodyHtml allows for larger text content
        '"published_at" TIMESTAMP, ' +
        '"sort_order" VARCHAR(255), ' +
        '"template_suffix" VARCHAR(255), ' +
        '"published_scope" VARCHAR(255), ' +
        '"admin_graphql_api_id" VARCHAR(255)' +
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
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "collections"."collections";');
  },
};
