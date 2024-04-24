import { BigQuery } from '@google-cloud/bigquery';
import { getBigQueryClient } from './client.js';
import schemas from './schema.js';

class BigQueryMigration {
  constructor() {
    this.bigquery = getBigQueryClient();
    this.tables = [
      {
        tableId: 'refund_fraud_monitoring',
        schema: schemas.refund_fraud_monitoring_schema,
      },
      {
        tableId: 'cost_price_monitoring',
        schema: schemas.cost_price_monitoring_schema,
      },
      {
        tableId: 'shopify_users',
        schema: schemas.shopify_users_schema,
      },
      {
        tableId: 'printing',
        schema: schemas.printing_schema,
      },
      {
        tableId: 'description_ai',
        schema: schemas.description_ai_schema,
      },
      {
        tableId: 'products',
        schema: schemas.products_schema,
      },
      {
        tableId: 'variants',
        schema: schemas.variants_schema,
      },
      {
        tableId: 'collections',
        schema: schemas.collections_schema,
      },
      {
        tableId: 'inventory_items',
        schema: schemas.inventory_items_schema,
      },
      {
        tableId: 'order_line_items',
        schema: schemas.order_line_items_schema,
      },
      {
        tableId: 'orders',
        schema: schemas.orders_schema,
      },
      
      // Add more table objects as needed
    ];
  }

  async createTableWithSchema(datasetId, tableId, schema) {
    // Check if the table already exists
    const [tableExists] = await this.bigquery.dataset(datasetId).table(tableId).exists();

    if (tableExists) {
      console.log(`Table '${tableId}' already exists. Skipping creation.`);
      return;
    }

    // Create the table with the specified schema
    await this.bigquery.dataset(datasetId).createTable(tableId, { schema });
    console.log(`Table '${tableId}' created.`);
  }

  async createTables() {
    try {
      for (const table of this.tables) {
        const { tableId, schema } = table;
        await this.createTableWithSchema(process.env.BIGQUERY_DATASET_ID, tableId, schema)
          .catch(async (error) => {
            console.error('Error creating tables: Retry', tableId);
            await this.createTableWithSchema(process.env.BIGQUERY_DATASET_ID, tableId, schema);
          });
      }
      console.log('Finished migration.');
    } catch (error) {
      console.error('Error creating tables:', error);
    }
  }
}

export default BigQueryMigration;
