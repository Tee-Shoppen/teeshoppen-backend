import express from 'express';
import dotenv from "dotenv";
import productsRouter from './routes/products.js';
import collectionsRouter from './routes/collection.js';
import BigQueryMigration from './database/migration.js';
import ordersRouter from './routes/order.js';
import {sequelize} from './database/postgresdb.js';
import { Umzug, SequelizeStorage } from 'umzug';
import fetchAllProducts from './controllers/fetchAll/fetchAllProducts.js';

dotenv.config({ path: "./.env" });

const creator = new BigQueryMigration();
const app = express();

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/collections', collectionsRouter);

app.listen(process.env.PORT || 8000, async function () {
    // await getBigQueryClient();
    //await creator.createTables();//migration process
   //fetchAllProducts();
    console.log('Listening to Port 8000');
});

//database connection
sequelize.authenticate()
  .then(async () => {
    console.log('Connected to the database');
    const umzug = new Umzug({
      migrations: { glob: 'src/migrations/*.cjs' },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({
        sequelize,
        schema: 'public',
        tableName: 'migrations',
        timestamps: true,
      }),
      logger: console,
    });
    await umzug.up().catch(async (err) => {
      console.log(err);
    });
  })
  .catch((err) => {
    console.log('Failed to connect to the database', err);
  });
