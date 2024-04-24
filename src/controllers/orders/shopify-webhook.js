/* eslint-disable no-underscore-dangle */
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import { getBigQueryClient } from "../../database/client.js";
const bigquery = getBigQueryClient();
const datasetId = process.env.BIGQUERY_DATASET_ID;
import orderCreation from "./create.js";


const shopifyWebhook = async (req, res, next) => {
  const { 'x-shopify-topic': topic } = req.headers
  const { body : data} = req

  switch (topic) {
    case 'orders/create': {
      console.log("TRACE orders/create webhook starts");
     // console.log("TRACE create new product", data);
      res.sendStatus(200);
      console.log('data.id', data.id);
      const existingOrder = `
                SELECT count(*) FROM ${datasetId}.orders where shopifyId=${data.id}`;
            try {
                // Run the SQL query
                const count = await bigquery.query(existingOrder);
                if (count > 0) {
                  console.log('Order exists..')
                  return;
                }
                console.log('CREATING Order..')
                await orderCreation(req);
                console.log("TRACE order/create webhook ends");
                return;
          
            } catch (error) {
                console.error('shopify-webhook/orders/create - Error running query:', error);
                return;
            }
       
    }
    case 'orders/update': {
      console.log("TRACE orders/update webhook starts");
      res.sendStatus(200);
            try {
                // Run the SQL query
                console.log('UPDATE WEBHOOK - CREATING NEW ORDER ROW..')
                await orderCreation(req);
                console.log("TRACE order/update - create webhook ends");
                return;
          
            } catch (error) {
                console.error('shopify-webhook/orders/update - Error running query:', error);
                return
            }
      }
    default:
    console.log('shopify-webhook', `Unexpected topic ${topic}`, 2);
  }
}

export default shopifyWebhook
