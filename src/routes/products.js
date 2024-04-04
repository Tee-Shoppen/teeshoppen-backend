import { catchAsync } from '../controllers/utilities/utils.js';
import productCreation from '../controllers/products/create.js';
import { retrieveManyProducts } from '../database/queries.js';
import express from 'express';

const productsRouter = express.Router();

const verify = (req, res, next) => {
    if (req.headers['x-server'] === 'true') {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };

productsRouter.post('/create', verify, catchAsync(productCreation));
productsRouter.get('/allProducts', verify, catchAsync(retrieveManyProducts));

export default productsRouter;