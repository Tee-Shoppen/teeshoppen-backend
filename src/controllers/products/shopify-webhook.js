/* eslint-disable no-underscore-dangle */
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import { getBigQueryClient } from "../../database/client.js";
const bigquery = getBigQueryClient();
const datasetId = process.env.BIGQUERY_DATASET_ID;
import { insertProduct, insertManyVariants, insertManyInventoryitems, updateProduct, updateOrCreateVariant } from '../../database/queries.js'
import { domainToSubDomain,subDomainMap } from '../utilities/shop-mapper.js'
import Shopify from '../apis/shopify.js'
import productCreation from "./create.js";


const shopifyWebhook = async (req, res, next) => {
  const { 'x-shopify-topic': topic } = req.headers
  const { body : data} = req

  switch (topic) {
    case 'products/create': {
      console.log("TRACE product/create webhook starts");
     // console.log("TRACE create new product", data);
      res.sendStatus(200);
      const existingProduct = `
                SELECT count(*) FROM ${datasetId}.products where id=${data.id}`;
            try {
                // Run the SQL query
                const count = await bigquery.query(existingProduct);
                if (count > 0) {
                  console.log('PRODUCT exists..')
                  return;
                }
                console.log('CREATING PRODUCT..')
                await productCreation(req);
                console.log("TRACE product/create webhook ends");
                return;
          
            } catch (error) {
                console.error('shopify-webhook/products/create - Error running query:', error);
            }
       
    }
    case 'products/update': {
      console.log("TRACE product/update webhook starts");
      console.log("Product: ShopifyId, title", data.id || "No ShopifyId", data.title || "No Title");
      //updateProduct(data.id, data);
      res.sendStatus(200);
            try {
                // Run the SQL query
                console.log('UPDATE WEBHOOK - CREATING NEW PRODUCT ROW..')
                await productCreation(req);
                console.log("TRACE product/create webhook ends");
                return;
          
            } catch (error) {
                console.error('shopify-webhook/products/update - Error running query:', error);
            }
          }
    // case 'products/delete': {
    //   console.log("TRACE product/delete webhook starts");
    //   if ((data.id ?? null) === null) {
    //     systemLog('shopify-webhook/products/delete', 'products/delete missing id', 2);
    //     return;
    //   }
    //   Product.destroy({ where: { shopifyId: data.id.toString() } })
    //     .then((resV) => {
    //       if (resV === 1) {
    //         systemLog('shopify-webhook/products/delete', `Deleted product ${data.id.toString()} successfully`, 3);
    //       } else {
    //         systemLog('shopify-webhook/products/delete', `Product ${data.id.toString()} not found for deleting`, 3);
    //       }
    //     })
    //     .catch((err) => {
    //       systemLog('shopify-webhook/products/delete', err.response?.data || err.stack || err.message || err.toString(), 2);
    //     });
    //   console.log("TRACE product/delete webhook ends");
    //   return;
    // }
    default:
    console.log('shopify-webhook', `Unexpected topic ${topic}`, 2);
  }
}

export default shopifyWebhook
