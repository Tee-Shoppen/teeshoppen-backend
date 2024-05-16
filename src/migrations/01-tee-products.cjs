module.exports = {
    up: async ({ context: queryInterface }) => {
      await queryInterface.sequelize.query('BEGIN;')
        .then(() => queryInterface.sequelize.query(
          'CREATE SCHEMA IF NOT EXISTS "products";',
        ))
        .then(() => queryInterface.sequelize.query(
            'CREATE TABLE "products"."products" (' +
            '"id" BIGINT PRIMARY KEY NOT NULL, ' +
            '"webshop" VARCHAR(255) NOT NULL, ' +
            '"title" VARCHAR(255) NOT NULL, ' +
            '"created_at" TIMESTAMP NOT NULL, ' +
            '"updated_at" TIMESTAMP NOT NULL, ' +
            '"deleted_at" TIMESTAMP, ' +
            '"published_at" TIMESTAMP, ' +
            '"last_ordered_at" TIMESTAMP, ' +
            '"vendor" VARCHAR(255), ' +
            '"body_html" TEXT, ' +
            '"product_type" VARCHAR(255), ' +
            '"handle" VARCHAR(255), ' +
            '"status" VARCHAR(255), ' +
            '"template_suffix" VARCHAR(255), ' +
            '"published_scope" VARCHAR(255), ' +
            '"tags" TEXT, ' +  // Assuming tags is a single string
            '"admin_graphql_api_id" VARCHAR(255)' +
            ');'

        ))
        .then(() => queryInterface.sequelize.query(
            'CREATE TABLE "products"."variants" (' +
            '"id" BIGINT PRIMARY KEY, ' +
            '"product_id" BIGINT NOT NULL REFERENCES "products"."products" ("id") ON DELETE CASCADE ON UPDATE CASCADE, '+
            '"inventory_item_id" BIGINT, ' +
            '"webshop" VARCHAR(255) NOT NULL, ' +
            '"title" VARCHAR(255) NOT NULL, ' +
            '"price" VARCHAR(255), ' + // Might need adjustment based on data format
            '"sku" VARCHAR(255), ' +
            '"position" BIGINT, ' +  // Assuming NOT NULL is not intended
            '"compare_at_price" DECIMAL(20,2), ' +
            '"fulfillment_service" VARCHAR(255), ' +
            '"inventory_management" VARCHAR(255), ' +
            '"option1" VARCHAR(255), ' +
            '"option2" VARCHAR(255), ' +
            '"option3" VARCHAR(255), ' +
            '"created_at" TIMESTAMP NOT NULL, ' +
            '"updated_at" TIMESTAMP NOT NULL, ' +
            '"deleted_at" TIMESTAMP,' +
            '"last_ordered_at" TIMESTAMP, ' +
            '"taxable" BOOLEAN, ' +
            '"barcode" VARCHAR(255), ' +
            '"grams" BIGINT, ' +        // Assuming NOT NULL is not intended
            '"image_id" BIGINT, ' +      // Assuming NOT NULL is not intended
            '"weight" DOUBLE PRECISION, ' +
            '"weight_unit" VARCHAR(255), ' +
            '"inventory_quantity" BIGINT, ' + // Assuming NOT NULL is not intended
            '"old_inventory_quantity" BIGINT, ' + // Assuming NOT NULL is not intended
            '"requires_shipping" BOOLEAN, ' +
            '"admin_graphql_api_id" VARCHAR(255)' +
            ');'
        ))
        .then(() => queryInterface.sequelize.query(
            'CREATE TABLE "products"."product_texts" (' +
            '"id" SERIAL PRIMARY KEY, ' +
            '"product_id" BIGINT NOT NULL, ' +
            '"webshop" VARCHAR(255) NOT NULL, ' +
            '"status" VARCHAR(255) NOT NULL, ' +
            '"title" VARCHAR(255) NOT NULL, ' +
            '"link" VARCHAR(255) NOT NULL, ' +
            '"store" VARCHAR(255) NOT NULL, ' +
            '"created_at" TIMESTAMP NOT NULL, ' +
            '"updated_at" TIMESTAMP NOT NULL, ' +
            '"deleted_at" TIMESTAMP, ' +
            '"category" VARCHAR(255) NOT NULL, ' +
            '"language" VARCHAR(255) NOT NULL, ' +
            '"new_description" TEXT NOT NULL, ' +
            '"new_title" TEXT NOT NULL, ' +
            '"new_seo_desc" TEXT NOT NULL, ' +
            '"meta_desc_id" BIGINT, ' +
            '"meta_title_id" BIGINT ' +
            ');'
        ))
        .then(() => queryInterface.sequelize.query('COMMIT;'))
        .catch((err) => {
          queryInterface.sequelize.query('ROLLBACK;');
          console.log(err);
          throw err;
        });
    },
  
    down: async ({ context: queryInterface }) => {
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS "products"."variants"');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS "products"."products"');
      await queryInterface.sequelize.query('DROP SCHEMA IF EXISTS "products"');
    },
  };
  