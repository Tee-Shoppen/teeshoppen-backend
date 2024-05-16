module.exports = {
    up: async ({ context: queryInterface }) => {
      await queryInterface.sequelize.query('BEGIN;')
        .then(() => queryInterface.sequelize.query(
          'CREATE SCHEMA IF NOT EXISTS "orders";',
        ))
        .then(() => queryInterface.sequelize.query(
            'CREATE TABLE "orders"."orders" (' +
            '"id" BIGINT PRIMARY KEY NOT NULL, ' +
            '"address_district" VARCHAR(255), ' +
            '"billing_district" VARCHAR(255), ' +
            '"customer_email" VARCHAR(255), ' +
            '"customer_phone" VARCHAR(255), ' +
            '"customer_first_name" VARCHAR(255), ' +
            '"customer_last_name" VARCHAR(255), ' +
            '"note" VARCHAR(255), ' +
            '"note_attributes" TEXT, ' +  // Assuming note_attributes is complex text data
            '"financial_status" VARCHAR(255), ' +
            '"payment_status" VARCHAR(255), ' +
            '"currency" VARCHAR(255) , ' +
            '"total_discounts" DOUBLE PRECISION, ' +
            '"total_duties" DOUBLE PRECISION, ' +
            '"total_tax" DOUBLE PRECISION, ' +
            '"subtotal_price" DOUBLE PRECISION, ' +
            '"total_price" DOUBLE PRECISION , ' +
            '"total_outstanding" DOUBLE PRECISION , ' +
            '"created_at" TIMESTAMP, ' +
            '"updated_at" TIMESTAMP, ' +
            '"deleted_at" TIMESTAMP, ' +
            '"closed_at" TIMESTAMP, ' +
            '"confirmed_at" TIMESTAMP, ' +
            '"cancelled_at" TIMESTAMP, ' +
            '"cancelled_reason" VARCHAR(255), ' +
            '"address_first_name" VARCHAR(255), ' +
            '"address_last_name" VARCHAR(255), ' +
            '"address_phone" VARCHAR(255), ' +
            '"address_line_one" VARCHAR(255), ' +
            '"address_line_two" VARCHAR(255), ' +
            '"address_city" VARCHAR(255), ' +
            '"address_province" VARCHAR(255), ' +
            '"address_country" VARCHAR(255), ' +
            '"address_zip" VARCHAR(255), ' +
            '"billing_first_name" VARCHAR(255) , ' +
            '"billing_last_name" VARCHAR(255) , ' +
            '"billing_phone" VARCHAR(255), ' +
            '"billing_address_line_one" VARCHAR(255) , ' +
            '"billing_address_line_two" VARCHAR(255), ' +
            '"billing_address_city" VARCHAR(255) , ' +
            '"billing_address_province" VARCHAR(255), ' +
            '"billing_address_country" VARCHAR(255) , ' +
            '"billing_address_zip" VARCHAR(255) , ' +
            '"billing_company" VARCHAR(255), ' +
            '"company_name" VARCHAR(255), ' +
            '"discount_applications" TEXT, ' +  // Assuming discount_applications is complex text data
            '"discount_codes" JSONB, ' +  // Using JSONB for flexible storage
            '"fulfillment_status" VARCHAR(255), ' +
            '"fulfillment_id" VARCHAR(255), ' +
            '"tags" VARCHAR(255), ' +
            '"status" VARCHAR(255) , ' +
            '"order_number" VARCHAR(255), ' +
            '"source" VARCHAR(255), ' +
            '"webshop" VARCHAR(255) NOT NULL, ' +
            '"priority" INTEGER, ' +  // Assuming priority is an integer
            '"shopify_shipping_line" VARCHAR(255), ' +
            '"tracking_number" VARCHAR(255), ' +
            '"source_url" VARCHAR(255)' +
            ');'
        ))
        .then(() => queryInterface.sequelize.query(
            'CREATE TABLE "orders"."order_line_items" ('
            + '"id" BIGINT PRIMARY KEY NOT NULL, '
            + '"order_id" BIGINT NOT NULL REFERENCES "orders"."orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE, '  // Assuming shopifyId on Order is the foreign key
            + '"product_id" BIGINT, '
            + '"product_title" TEXT, '
            + '"product_variant_id" BIGINT, '
            + '"product_variant_title" TEXT, '
            + '"quantity" BIGINT NOT NULL, '
            + '"discounts" DECIMAL(20,2), '  // Adjust decimal precision if needed
            + '"duties" DECIMAL(20,2), '  // Adjust decimal precision if needed
            + '"tax" DECIMAL(20,2), '  // Adjust decimal precision if needed
            + '"price" DECIMAL(20,2) NOT NULL, '  // Adjust decimal precision if needed
            + '"currency" TEXT NOT NULL, '
            + '"discount_allocations" JSONB, '  // Assuming JSON data is stored as JSONB
            + '"discount_applications" TEXT, '
            + '"discount_codes" TEXT, '
            + '"fulfillable_quantity" BIGINT, '
            + '"fulfillment_service" TEXT, '
            + '"fulfillment_status" TEXT, '
            + '"weight" DECIMAL(20,2), '  // Adjust decimal precision if needed
            + '"weight_unit" TEXT, '
            + '"status" TEXT NOT NULL DEFAULT \'pending purchase\', '
            + '"conversion_rate" TEXT NOT NULL DEFAULT \'1030\', '
            + '"created_at" TIMESTAMP WITH TIME ZONE NOT NULL, '
            + '"updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, '
            + '"deleted_at" TIMESTAMP WITH TIME ZONE '
            + ');'          
        ))
        .then(() => queryInterface.sequelize.query('COMMIT;'))
        .catch((err) => {
          queryInterface.sequelize.query('ROLLBACK;');
          console.log(err);
          throw err;
        });
    },
  
    down: async ({ context: queryInterface }) => {
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS "orders"."order_line_items"');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS "orders"."orders"');
      await queryInterface.sequelize.query('DROP SCHEMA IF EXISTS "orders"');
    },
  };
  