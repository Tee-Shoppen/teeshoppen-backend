import dotenv from "dotenv";
import { catchAsync } from '../controllers/utilities/utils.js';
import orderCreation from '../controllers/products/create.js';
import {retrieveOrder } from '../database/queries.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../controllers/products/swagger.json' assert { type: "json" };
import shopifyWebhook from "../controllers/orders/shopify-webhook.js";
import express from 'express';
import bodyParser from "body-parser";
import fetchAllOrders from "../controllers/fetchAll/fetchAllOrders.js";
import fetchAllOrdersSingleStore from "../controllers/fetchAll/fetchAllOrders-single.js";

dotenv.config({ path: "./.env" });
const ordersRouter = express.Router();

/**
 * Swagger Documentation
 */
const swaggerSort = (a, b) => {
  const METHOD_PRIORITY_LIST = {
    get: 0,
    post: 1,
    patch: 2,
    put: 3,
    delete: 4,
  };
  // eslint-disable-next-line no-underscore-dangle
  return METHOD_PRIORITY_LIST[a._root.entries[1][1]] - METHOD_PRIORITY_LIST[b._root.entries[1][1]];
};

ordersRouter.use('/api-docs', swaggerUi.serveFiles(swaggerDocument), swaggerUi.setup(swaggerDocument,
    { swaggerOptions: { displayRequestDuration: true, operationsSorter: swaggerSort, persistAuthorization: true } }));

const BodyParser = bodyParser.json({
      limit: '10mb',
      verify: (req, _, buf) => {
        ;(req ).rawBody = buf
      },
    }) 
    
ordersRouter.use(BodyParser);

const verify = (req, res, next) => {
    if (req.headers['x-server'] === 'true') {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized verify' });
    }
  };

//orders
//fetchAll
ordersRouter.get('/fetchAll', verify, catchAsync(fetchAllOrders));
ordersRouter.get('/fetch-all-single-store', verify, catchAsync(fetchAllOrdersSingleStore));

ordersRouter.get('/:id', verify, catchAsync(retrieveOrder));
ordersRouter.post('/create', verify, catchAsync(orderCreation));
ordersRouter.post('/shopify-webhook', catchAsync(shopifyWebhook));

export default ordersRouter;