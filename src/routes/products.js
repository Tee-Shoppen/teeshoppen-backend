import dotenv from "dotenv";
import { catchAsync } from '../controllers/utilities/utils.js';
import productCreation from '../controllers/products/create.js';
import { retrieveManyProducts, retrieveProduct, retrieveVariant } from '../database/queries.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../controllers/products/swagger.json' assert { type: "json" };
import express from 'express';

dotenv.config({ path: "./.env" });
const productsRouter = express.Router();

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

productsRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,
    { swaggerOptions: { displayRequestDuration: true, operationsSorter: swaggerSort, persistAuthorization: true } }));



const verify = (req, res, next) => {
    if (req.headers['x-server'] === 'true') {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized verify' });
    }
  };

//products
productsRouter.get('/', verify,catchAsync(retrieveManyProducts));
productsRouter.get('/:id', verify, catchAsync(retrieveProduct));
//
productsRouter.post('/create', verify, catchAsync(productCreation));


//variants
productsRouter.get('/variant/:id', verify, catchAsync(retrieveVariant));


export default productsRouter;