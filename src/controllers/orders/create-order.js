import axios from 'axios';
import { mapShopifyResponseToWareLineItemStatuses, mapShopifyResponseToWareOrderStatuses } from './utils.js';

export const createShippingLine =  (shippingLine, orderCreated, orderUpdated, orderNumber, discountApps, discountCodes) => {
  const returnObj = {
    orderNumber: orderNumber,
    shopifyId: shippingLine.id,
    carrierIdentifier: shippingLine.carrier_identifier,
    code: shippingLine.code,
    discountedPrice: shippingLine.discounted_price,
    discountedPriceSet: shippingLine.discounted_price_set,
    phone: shippingLine.phone,
    price: shippingLine.price,
    priceSet: shippingLine.price_set,
    requestedFulfillmentServiceId: shippingLine.requested_fulfillment_service_id,
    source: shippingLine.source,
    title: shippingLine.title,
    taxLines: shippingLine.tax_lines,
    discountAllocations: shippingLine.discount_allocations,
    discountApplications: discountApps,
    discountCodes: discountCodes,
    createdAt: orderCreated,
    updatedAt: orderUpdated
  };

  return returnObj;
};

export const createLineItem = async (lineItem, orderCreated, orderUpdated, currency, orderStatus, orderFinancialStatus, order, refunds, discountApps, discountCodes) => {
    console.log('================ LINE ITEM RAW =================');
  console.log(JSON.stringify(lineItem, null, 2));
  console.log('===============================================');
  const [status, fulfillmentStatus] = mapShopifyResponseToWareLineItemStatuses(lineItem.fulfillment_status, orderStatus);
  const returnObj = {
    status,
    fulfillmentStatus,
    sku: lineItem.sku || null,
  };

  if (lineItem.product_exists) {
    let l = `${process.env.NODE_ENV=='development'?process.env.ROOT_URL:process.env.LIVE_URL}/api/products/variant/${lineItem.variant_id}`
    //console.log(l);
    await axios.get(`${process.env.NODE_ENV=='development'?process.env.ROOT_URL:process.env.LIVE_URL}/api/products/variant/${lineItem.variant_id}`, {
        headers: {
            'x-server': true,
          },
    }).then(async(res) => {
      // if(res){
      //   console.log('--------------res', res.data.variant.id);
      // }
      returnObj.product_variant_id = res.data.variant.id;
      returnObj.product_variant_title = res.data.variant.title;
      returnObj.product_id = res.data.variant.product_id;
      returnObj.sku = returnObj.sku || res.data.variant.sku || null;
     
    }).catch((err) =>{
      console.log(`no value!!!, ERROR variant id ${lineItem.variant_id}`)
      return;
    });
    returnObj.id=lineItem.id
    returnObj.product_title = lineItem.title;
    returnObj.order_id=order.id
    returnObj.sku = lineItem.sku;

  } else {
    console.log("create-from-shopify, PRODUCT DOES NOT EXIST in DB,Order id : ",order.id + 'variant id ', lineItem.variant_id);
    returnObj.id=lineItem.id
    returnObj.product_title = lineItem.title;
    returnObj.order_id=order.id
    returnObj.sku = lineItem.sku;

    // await createCustomProduct(lineItem, order).then((res) => {
    //   returnObj.productVariantId = res.data.product.variants[0].id;
    //   returnObj.productVariantTitle = res.data.product.variants[0].title;
    //   returnObj.productId = res.data.product.id;
    // });
    // returnObj.customProductName = lineItem.name;
  }
  // if (!returnObj.productVariantId && !returnObj.customProductName) {
  //   returnObj.customProductName = lineItem.name;
  // }

  let x = 0;

  // console.log('refund length', refunds.length)

  if (refunds.length > 0 ) {
    await refunds.find((o, i) => {
      if (o.line_item_id == lineItem.id ) {
        returnObj.fulfillable_quantity = lineItem.fulfillable_quantity;
        returnObj.quantity = lineItem.quantity == 0 ? 0 : lineItem.quantity - refunds[i].quantity;
        x = 1;
      }
    });
  } 

  // console.log('x', x)

  if (x) {
    // returnObj.fulfillableQuantity = lineItem.fulfillable_quantity;
    returnObj.fulfillment_service = lineItem.fulfillment_service;
    returnObj.fulfillment_status = lineItem.fulfillment_status;
    //returnObj.allocatedQuantity = 0;

  } else {

    returnObj.fulfillable_quantity = lineItem.fulfillable_quantity;
    returnObj.fulfillment_service = lineItem.fulfillment_service;
    returnObj.fulfillment_status = lineItem.fulfillment_status;
    //returnObj.allocatedQuantity = 0;
    returnObj.quantity = lineItem.quantity;
    //returnObj.discounts = lineItem.total_discount ?? 0.00;

  }
  

  //get total discount from lineItem
  let total_line_item_discount = Number(0);
  
  for await (var item of lineItem.discount_allocations) {
    //Haikal correcting original one not accumulating discount amount. original line is below
    //total_line_item_discount = item.amount
    total_line_item_discount = Number(total_line_item_discount) + Number(item.amount);
  }
  returnObj.discounts = total_line_item_discount;
  returnObj.discount_allocations = JSON.stringify(lineItem.discount_allocations);
  returnObj.discount_applications = discountApps;
  returnObj.discount_codes = discountCodes;

  returnObj.price = lineItem.price;

  returnObj.currency = currency;
  // returnObj.refundedAt = lineItem.;
  // returnObj.refundedAmount = lineItem.;
  returnObj.weight = lineItem.grams;
  returnObj.weight_unit = 'grams';
  returnObj.created_at = orderCreated;
  returnObj.updated_at = orderUpdated;
  returnObj.shopify_id = lineItem.id;
  if (['completed', 'cancelled', 'refunded'].includes(orderStatus)) {
    returnObj.status = orderStatus;
    return [returnObj, null];
  }
  if ('product_variant_id' in returnObj && orderFinancialStatus === 'paid') {
    if (returnObj.status === "received") returnObj.status = "pending purchase";
    return [returnObj, returnObj.product_variant_dd];
  }
  return [returnObj, null];
};

async function createOrderModel(iincoming,webshop) {
  let order = iincoming; 
  let order_source = '';
  if (order.source = 'shopify') {
    order_source = 'shopify'
  }

  //console.log('******************order tag-------------', order.tags);
  
   //check if there is a fulfillment
   let fulfillmentId = null
   if(order.fulfillments.length > 0) {
    fulfillmentId = order.fulfillments[order.fulfillments.length-1].id
   }
 
  const reallocateVariants = [];

 const [status, fulfillmentStatus] = mapShopifyResponseToWareOrderStatuses(order.fulfillment_status, order.financial_status);
  const orderModel = {
    id: order.id,
    createdAt: order.created_at,
    deletedAt: null,
    updatedAt: order.updated_at || order.created_at,
    closed_at: order.closed_at,
    customer_email: order.email,
    customer_phone: order.phone,
    note: order.note,
    note_attributes: JSON.stringify(order.note_attributes),
    financial_status: order.financial_status,
    payment_status: order.payment_status,
    currency: order.currency,
    priority: 1,
    total_discounts: order.total_discounts ?? 0.00,
    total_tax: order.total_tax ?? 0.00,
    total_duties: order.original_total_duties_set?.shop_money?.amount ?? 0.00,
    subtotal_price: order.subtotal_price ?? 0.00,
    total_price: order.total_price ?? 0.00,
    total_outstanding: order.total_outstanding ?? 0.00,
    cancelled_at: order.cancelled_at,
    cancelled_reason: order.cancel_reason,
    fulfillment_status: order.fulfillment_status,
    fulfillment_id: fulfillmentId, // Assuming fulfillmentId is already defined
    shopify_shipping_line: order.shipping_lines?.reduce((prev, curr) => (prev.concat(curr.code)), "") ?? null,
    status: status,  // Assuming status is already defined
    source: order_source,  // Assuming order_source is already defined
    webshop: webshop,  // Assuming webshop is already defined
    order_number: order.name,
    source_url: order.source_url,
    // risk: risk  // Assuming risk is already defined
    // id: order.id,
    // createdAt: order.created_at,
    // deletedAt: null,
    // updatedAt: order.updated_at || order.created_at,
    // closedAt: order.closed_at,
    // customerEmail: order.email,
    // customerPhone: order.phone,
    // note: order.note,
    // noteAttributes : JSON.stringify(order.note_attributes),
    // financialStatus: order.financial_status,
    // paymentStatus: order.payment_status,
    // currency: order.currency,
    // priority: 1,
    // totalDiscounts: order.total_discounts ?? 0.00,
    // totalTax: order.total_tax ?? 0.00,
    // totalDuties: order.original_total_duties_set?.shop_money?.amount ?? 0.00,
    // subtotalPrice: order.subtotal_price ?? 0.00,
    // totalPrice: order.total_price ?? 0.00,
    // totalOutstanding: order.total_outstanding ?? 0.00,
    // cancelledAt: order.cancelled_at,
    // cancelledReason: order.cancel_reason,
    // fulfillmentStatus:order.fulfillment_status,
    // fulfillmentId,
    // //shopifyShippingLine: order.shipping_lines?.reduce((prev, curr) => (prev.concat(curr.code)), "") ?? null,
    // status,
    // source: order_source,
    // webshop: webshop,
    // orderNumber: order.name,
    // sourceUrl: order.source_url,
    // // risk : risk
  };

  if ((order.tags ?? '') !== '') {
    orderModel.tags = order.tags.split(',').map((tg) => tg.trim()).toString();
  }
  if (order.customer) {
    orderModel.customer_first_name = order.customer.first_name;
    orderModel.customer_last_name = order.customer.last_name;
  }

  if (order.billing_address) {
    orderModel.billing_first_name = order.billing_address.first_name;
    orderModel.billing_last_name = order.billing_address.last_name;
    orderModel.billing_phone = order.billing_address.phone;
    orderModel.billing_address_line_one = order.billing_address.address1;
    if (order.billing_address.address2) {
      orderModel.billing_address_line_two = order.billing_address.address2;
    }
    orderModel.billing_address_city = order.billing_address.city;
    orderModel.billing_address_province = order.billing_address.province;
    orderModel.billing_address_country = order.billing_address.country;
    orderModel.billing_address_zip = order.billing_address.zip;
    
    if (order.billing_address.company)
      orderModel.billing_company = order.billing_address.company;
  }
  
  if (order.shipping_address) {
    orderModel.address_first_name = order.shipping_address.first_name;
    orderModel.address_last_name = order.shipping_address.last_name;
    orderModel.address_phone = order.shipping_address.phone;
    orderModel.address_line_one = order.shipping_address.address1;
    if (order.shipping_address.address2) {
      orderModel.address_line_two = order.shipping_address.address2;
    }
    orderModel.address_city = order.shipping_address.city;
    orderModel.address_province = order.shipping_address.province;
    orderModel.address_country = order.shipping_address.country;
    orderModel.address_zip = order.shipping_address.zip;

    if (order.shipping_address.company)
      orderModel.company_name = order.shipping_address.company;
    
  }
  const discountApps = JSON.stringify(order.discount_applications);
  const discountCodes = JSON.stringify(order.discount_codes);

  //Discounts
  orderModel.discount_applications = discountApps; 
  orderModel.discount_codes = discountCodes;

  // let refunds = order.refunds ? order.refunds : []
  const refundss_array = order.refunds ? order.refunds.flatMap(x => x.refund_line_items.map(y => y)) : []
  // const refunds_array_lineItem = refundss_array.flatMap(l => l.line_item_id)

  const result = await Promise.all(order.line_items.map((lineItem) => (
    createLineItem(lineItem, order.created_at, order.updated_at, order.currency, orderModel.status, orderModel.financial_status, orderModel,refundss_array, discountApps, discountCodes)
  )));

  const lineItems = [];

  result.forEach(([lineItem, variant]) => {
    if (variant) reallocateVariants.push(variant);
    if (lineItem) lineItems.push(lineItem);
  });

  orderModel.lineItems = lineItems;
  // const shippingLines = [];

//   for(let b=0; b < order.shipping_lines.length; b++){
//     const line = createShippingLine(order.shipping_lines[b], order.created_at, order.updated_at, order.name, discountApps, discountCodes);    
//     shippingLines.push(line);
//   }
   
//   orderModel.shippingLines = shippingLines;

  return orderModel;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default createOrderModel;
