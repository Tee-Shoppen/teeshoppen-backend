/* eslint-disable no-underscore-dangle */
import { insertProduct, insertManyInventoryitems } from '../../database/queries.js'
import { Product } from "../../database/postgresdb.js";
import createProductModel from "./create-from-shopify.js";
import { putProductIncludesVariants } from './product-service.js';
import generateProductDescriptionSingle from '../descriptionAI/generateSingle.js';


const shopifyWebhook = async (req, res, next) => {
  const { 'x-shopify-topic': topic } = req.headers
  const { body : data} = req

  switch (topic) {
    case 'products/create': {
      console.log("TRACE product/create webhook starts");
      res.sendStatus(200);
      const existingProduct = await Product.findOne({ where: { id: data.id.toString() } });
      if (existingProduct) {
        return;
      }
      console.log('CREATING PRODUCT..')
      let mapped = await createProductModel(req);
      await insertProduct(mapped);
      await insertManyInventoryitems(mapped.inventory);
      if(mapped.body_html.length < 500) {
        await generateProductDescriptionSingle(product.id);
      }
      console.log("TRACE product/create webhook ends");
      return;
      
       
    }
    case 'products/update': {
      console.log("TRACE product/update webhook starts");
      console.log("Product: ShopifyId, title", data.id || "No ShopifyId", data.title || "No Title");
      //updateProduct(data.id, data);
      res.sendStatus(200);
            try {
                // Run the SQL query
                console.log('UPDATE WEBHOOK - UPDATING PRODUCT ROW..')
                //await productCreation(req);
                let mapped = await createProductModel(req);
                await putProductIncludesVariants(mapped);
                
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
