module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query('BEGIN;')
    .then(() => queryInterface.sequelize.query(
      'CREATE SCHEMA IF NOT EXISTS "inventory_items";',
    ))
      .then(() => queryInterface.sequelize.query(
        'CREATE TABLE "inventory_items"."inventory_items" (' +
        '"id" BIGINT PRIMARY KEY NOT NULL, ' +
        '"variant_id" BIGINT NOT NULL, ' +  // Assuming variantId is a foreign key
        '"webshop" VARCHAR(255) NOT NULL, ' +
        '"cost" NUMERIC NOT NULL, ' +   // Assuming cost represents a monetary value
        '"country_code_of_origin" VARCHAR(255), ' +
        '"country_harmonized_system_codes" JSONB DEFAULT \'[]\', ' +  // Using JSONB for flexible data storage
        '"created_at" TIMESTAMP NOT NULL, ' +
        '"deleted_at" TIMESTAMP, ' +
        '"harmonized_system_code" BIGINT, ' +  // Adjust if HS code is a string
        '"province_code_of_origin" VARCHAR(255), ' +
        '"sku" VARCHAR(255), ' +
        '"tracked" BOOLEAN, ' +
        '"updated_at" TIMESTAMP NOT NULL, ' +
        '"requires_shipping" BOOLEAN' +
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
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "inventory_items"."inventory_items";');
  },
};
