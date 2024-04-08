import express from 'express';
import dotenv from "dotenv";
import productsRouter from './routes/products.js';
import collectionsRouter from './routes/collection.js';
import BigQueryMigration from './database/migration.js';
import fetchAllProducts from './controllers/fetchAll/fetchAll.js';

dotenv.config({ path: "./.env" });
const creator = new BigQueryMigration();
const app = express();

app.use('/api/products', productsRouter);
app.use('/api/collections', collectionsRouter);


app.listen(process.env.PORT || 8000, function () {
    creator.createTables();//migration process
    //fetchAllProducts();
    console.log('Listening to Port 8000');
});