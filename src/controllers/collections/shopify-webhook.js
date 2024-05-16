/* eslint-disable no-underscore-dangle */
import { getBigQueryClient } from "../../database/client.js";
import { Collection } from "../../database/postgresdb.js";
import { insertCollection } from "../../database/queries.js";
const bigquery = getBigQueryClient();
const datasetId = process.env.BIGQUERY_DATASET_ID;
import collectionCreation from "./create.js";

const shopifyWebhook = async (req, res, next) => {
  const { 'x-shopify-topic': topic } = req.headers
  const { body : data} = req

  switch (topic) {
    case 'collections/create': {
      console.log("TRACE collection/create webhook starts");
     // console.log("TRACE create new collection", data);
      res.sendStatus(200);
            try {
                // Run the SQL query
                // const count = await bigquery.query(existingCollection);
                // if (count > 0) {
                //   console.log('COLLECTION exists..')
                //   return;
                // }
                // console.log('CREATING COLLECTION..')
                await insertCollection(collectionCreation(req));
                console.log("TRACE collection/create webhook ends");
                return;
          
            } catch (error) {
                console.error('shopify-webhook/collections/create - Error running query:', error);
            }
       
    }
    case 'collections/update': {
      console.log("TRACE collection/update webhook starts");
      res.sendStatus(200);
            try {
                // Run the SQL query
                console.log('UPDATE WEBHOOK - UPDATING COLLECTION ROW..')
                //await collectionCreation(req);
                let coll = await Collection.findOne({where : {id:req.body.id}})
                if (!coll){
                  console.log('NO EXISTING COLLECTION');
                  return;
                }
                let newColl = collectionCreation(req);
                coll.update({...newColl});
                console.log("TRACE collection/create webhook ends");
                return;
          
            } catch (error) {
                console.error('shopify-webhook/collections/update - Error running query:', error);
            }
          }
    // case 'collections/delete': {
    //   console.log("TRACE collection/delete webhook starts");
    //   if ((data.id ?? null) === null) {
    //     systemLog('shopify-webhook/collections/delete', 'collections/delete missing id', 2);
    //     return;
    //   }
    //   Product.destroy({ where: { shopifyId: data.id.toString() } })
    //     .then((resV) => {
    //       if (resV === 1) {
    //         systemLog('shopify-webhook/collections/delete', `Deleted collection ${data.id.toString()} successfully`, 3);
    //       } else {
    //         systemLog('shopify-webhook/collections/delete', `Product ${data.id.toString()} not found for deleting`, 3);
    //       }
    //     })
    //     .catch((err) => {
    //       systemLog('shopify-webhook/collections/delete', err.response?.data || err.stack || err.message || err.toString(), 2);
    //     });
    //   console.log("TRACE collection/delete webhook ends");
    //   return;
    // }
    default:
    console.log('shopify-webhook', `Unexpected topic ${topic}`, 2);
  }
}

export default shopifyWebhook
