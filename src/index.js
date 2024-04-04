import express from 'express';
import dotenv from "dotenv";
import productsRouter from './routes/products.js';
import BigQueryMigration from './database/migration.js';

dotenv.config({ path: "./.env" });
const creator = new BigQueryMigration();
const app = express();
app.use('/api/products', productsRouter);


app.listen(8000, function () {
    creator.createTables();//migration process
    console.log('Listening to Port 8000');
});