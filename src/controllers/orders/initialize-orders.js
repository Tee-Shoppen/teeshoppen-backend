/* eslint-disable no-await-in-loop */
import axios from 'axios';
import createOrderModel from './create-order.js';
import { insertManyOrders, insertManyOrderLineItems } from '../../database/queries.js';
import Shopify from '../apis/shopify.js';
import { subDomainMap } from '../utilities/shop-mapper.js';

// Helper function
const domainInformation = (subDomain) => {
  const subDomainInfo = subDomainMap(subDomain)

  console.log(subDomainInfo);
  
  let apiKeys = process.env.GOOGLE_PROJECT_ID;

  const { [subDomainInfo.apiKey] : apiKey } = process.env

  if (!apiKey) {
    throw new Error('API key not provided.')
  }
 
  else return { ...subDomainInfo, api: apiKey }
}

async function handleCreateOrders(orders,webshop) {
  console.log(orders.length,'FETCHING ORDERS IN BACKEND...');
  const orderList = [];
  for (let p = 0; p < orders.length; p += 1) {
     await orderList.push(await createOrderModel(orders[p],webshop));
  }
  let x=0;
  await Promise.all(orderList).then(
    await orderList.forEach(async (processedOrders) => {
      let lineItem = processedOrders[0].lineItems;
      //console.log('line items---------------------', lineItem);
      await delete processedOrders[0].lineItems;
      await insertManyOrders(processedOrders[0]),
      await insertManyOrderLineItems(lineItem)
    })
  )
 
    
}

async function initializeOrders(subDomain) {

  const { name, country, api } = domainInformation(subDomain)

  var d = new Date();
  // d.setMonth(d.getMonth() - 3);
  //let url = `${process.env.SHOPIFY_URL}/orders.json?status=any&created_at_min=${d}`;
  let url = `https://${name}.myshopify.com/admin/api/2023-10/orders.json?status=any`;
  let startTime = new Date();
  let nextLinkExist;

  for (let page = 0; page < 1; page += 1) {
    nextLinkExist = false;
    // eslint-disable-next-line no-await-in-loop
    await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': api,
      },
      params: {
        limit: 250, // 50-250
        fields: 'id,created_at,updated_at,closed_at,email,phone,customer,customer,note,'
          + 'financial_status,currency,total_discounts,total_tax,tags,'
          + 'subtotal_price,total_price,total_outstanding,'
          + 'cancelled_at,cancel_reason,fulfillment_status,source_name,billing_address,customer,'
          + 'shipping_address,shipping_lines,original_total_duties_set,'
          + 'customer,line_items,fulfillments,refunds,name,discount_applications,note_attributes,discount_codes',
      },
    })
      // eslint-disable-next-line no-loop-func
      .then(async (svRes) => {
        const shopifyOrders = svRes.data.orders;
        if (svRes.headers.link) {
          const baseLinks = svRes.headers.link.split(', ');
          for (let i = 0; i < baseLinks.length; i += 1) {
            const links = baseLinks[i].split('; ');
            if (links[1] === 'rel="next"') {
              url = links[0].slice(1, -1);
              nextLinkExist = true;
            }
          }
        }
        const dbt = new Date();
        console.log(`${shopifyOrders.length} orders fetched in ${dbt - startTime}ms`);
        await handleCreateOrders(shopifyOrders,name).then(() => {
          console.log(`${shopifyOrders.length} orders written to database in ${new Date() - dbt}ms`);
        });
        startTime = new Date();
      })
      .catch((err) => {
        console.log('initialize-orders', err.response?.data || err.stack || err.message || err.toString(), 1);
      });
    if (!nextLinkExist) {
      break;
    }
  }
}

export default initializeOrders;
