import dotenv from "dotenv";
import bodyParser from "body-parser";
import { catchAsync } from '../controllers/utilities/utils.js';
import collectionCreation from "../controllers/collections/create.js";
import { retrieveCollection, retrieveManyCollections } from '../database/queries.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../controllers/collections/swagger.json' assert { type: "json" };
import express from 'express';
import shopifyWebhook from "../controllers/collections/shopify-webhook.js";

dotenv.config({ path: "./.env" });
const collectionsRouter = express.Router();

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

collectionsRouter.use('/api-docs', swaggerUi.serveFiles(swaggerDocument), swaggerUi.setup(swaggerDocument,
    { swaggerOptions: { displayRequestDuration: true, operationsSorter: swaggerSort, persistAuthorization: true } }));

    const BodyParser = bodyParser.json({
      limit: '10mb',
      verify: (req, _, buf) => {
        ;(req ).rawBody = buf
      },
    }) 
    
    collectionsRouter.use(BodyParser);

const verify = (req, res, next) => {
    if (req.headers['x-server'] === 'true') {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized verify' });
    }
  };

//products
collectionsRouter.get('/', verify,catchAsync(retrieveManyCollections));
collectionsRouter.get('/:id', verify, catchAsync(retrieveCollection));
//
collectionsRouter.post('/create', verify, catchAsync(collectionCreation));
collectionsRouter.post('/shopify-webhook', catchAsync(shopifyWebhook));



export default collectionsRouter;