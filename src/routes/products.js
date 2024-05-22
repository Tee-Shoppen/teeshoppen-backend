import dotenv from "dotenv";
import bodyParser from 'body-parser'
import { catchAsync } from '../controllers/utilities/utils.js';
import productCreation from '../controllers/products/create.js';
import { retrieveManyProducts, retrieveProduct, retrieveVariant, updateProduct, retrieveProductUpdatedAt, updateMetaField, retrieveProductsforAI, updateBulkMetaField} from '../database/queries.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../controllers/products/swagger.json' assert { type: "json" };
import express from 'express';
import shopifyWebhook from "../controllers/products/shopify-webhook.js";
import fetchAllProducts from "../controllers/fetchAll/fetchAllProducts.js";
import generateProductDescription from "../controllers/descriptionAI/generateMultiple.js";

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

productsRouter.use('/api-docs', swaggerUi.serveFiles(swaggerDocument), swaggerUi.setup(swaggerDocument,
    { swaggerOptions: { displayRequestDuration: true, operationsSorter: swaggerSort, persistAuthorization: true } }));

const BodyParser = bodyParser.json({
      limit: '10mb',
      verify: (req, _, buf) => {
        ;(req ).rawBody = buf
      },
    }) 
    
productsRouter.use(BodyParser);

const verify = (req, res, next) => {
    if ((req.headers['x-server'] === 'true') || (req.headers['X-Shopify-Shop-Domain'] === 'true')) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized verify' });
    }
  };


//products

//fetchall
productsRouter.get('/fetchAll', verify,catchAsync(fetchAllProducts));
productsRouter.get('/', verify,catchAsync(retrieveManyProducts));
productsRouter.get('/:id', verify, catchAsync(retrieveProduct));
productsRouter.get('/updated/:id', verify, catchAsync(retrieveProductUpdatedAt));

//
//productsRouter.post('/create', verify, catchAsync(productCreation));
productsRouter.post('/update', verify,catchAsync(updateProduct));
productsRouter.post('/shopify-webhook', catchAsync(shopifyWebhook));
productsRouter.post('/generate-desc', verify, catchAsync(generateProductDescription));
productsRouter.post('/update-desc/:id', verify, catchAsync(updateMetaField));
productsRouter.post('/bulk-update-metafield', verify, catchAsync(updateBulkMetaField));
productsRouter.post('/retrieve', verify, catchAsync(retrieveProductsforAI));

//variants
productsRouter.get('/variant/:id', verify, catchAsync(retrieveVariant));


export default productsRouter;