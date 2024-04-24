import express from 'express';
import dotenv from "dotenv";
import productsRouter from './routes/products.js';
import collectionsRouter from './routes/collection.js';
import BigQueryMigration from './database/migration.js';
import { getBigQueryClient } from './database/client.js';
import ordersRouter from './routes/order.js';

dotenv.config({ path: "./.env" });
const creator = new BigQueryMigration();
const app = express();

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/collections', collectionsRouter);

app.listen(process.env.PORT || 8000, async function () {
    // await getBigQueryClient();
    await creator.createTables();//migration process
   //fetchAllProducts();
    console.log('Listening to Port 8000');
});