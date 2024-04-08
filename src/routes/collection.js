import dotenv from "dotenv";
import { catchAsync } from '../controllers/utilities/utils.js';
import collectionCreation from "../controllers/collections/create.js";
import { retrieveCollection, retrieveManyCollections } from '../database/queries.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../controllers/collections/swagger.json' assert { type: "json" };
import express from 'express';

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

if (process.env.NODE_ENV === 'development') {
  collectionsRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,
    { swaggerOptions: { displayRequestDuration: true, operationsSorter: swaggerSort, persistAuthorization: true } }));
}


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



export default collectionsRouter;