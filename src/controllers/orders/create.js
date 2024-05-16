import { insertOrder, insertOrderLineItem } from '../../database/queries.js'
import { domainToSubDomain,subDomainMap } from '../utilities/shop-mapper.js'
import createOrderModel from './create-order.js';

const orderCreation = async (req) => {

    const { body: order } = req
    const { 'x-shopify-shop-domain': domain } = req.headers
    const domainInformation = subDomainMap(domainToSubDomain(domain))
    const webshop = domainInformation.name
 
    const [model, variants] = await createOrderModel(order,webshop);

    let lineItemsOnly = model.lineItems;
    await delete model.lineItems;
    // await insertOrder(model);
    
    // if (lineItemsOnly.length > 0) {
    //    lineItemsOnly.forEach( async lineItem => {
    //       await insertOrderLineItem(lineItem)
    //   });
    // }
  
    console.log(
      'Order Creation done.'
    )
}

export default orderCreation
