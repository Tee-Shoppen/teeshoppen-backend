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
  const [status, fulfillmentStatus] = mapShopifyResponseToWareLineItemStatuses(lineItem.fulfillment_status, orderStatus);
  const returnObj = {
    status,
    fulfillmentStatus,
  };

  if (lineItem.product_exists) {
    //let l = `${process.env.NODE_ENV=='development'?process.env.ROOT_URL:process.env.LIVE_URL}/api/products/variant/${lineItem.variant_id}`
    await axios.get(`${process.env.NODE_ENV=='development'?process.env.ROOT_URL:process.env.LIVE_URL}/api/products/variant/${lineItem.variant_id}`, {
        headers: {
            'x-server': true,
          },
    }).then((res) => {
      returnObj.productVariantId = res.data.variant[0].id;
      returnObj.productVariantTitle = res.data.variant[0].title;
      returnObj.productId = res.data.variant[0].product_id;
    }).catch((err) => null);
    returnObj.productTitle = lineItem.title;
    returnObj.id=lineItem.id
    returnObj.orderId=order.shopifyId

    //console.log('lineItem', lineItem)
  } else {
    console.log("create-from-shopify, PRODUCT_EXIST IS FALSE", JSON.stringify(lineItem,null,4));
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
        returnObj.fulfillableQuantity = lineItem.fulfillable_quantity;
        returnObj.quantity = lineItem.quantity == 0 ? 0 : lineItem.quantity - refunds[i].quantity;
        x = 1;
      }
    });
  } 

  // console.log('x', x)

  if (x) {
    // returnObj.fulfillableQuantity = lineItem.fulfillable_quantity;
    returnObj.fulfillmentService = lineItem.fulfillment_service;
    returnObj.fulfillmentStatus = lineItem.fulfillment_status;
    //returnObj.allocatedQuantity = 0;

  } else {

    returnObj.fulfillableQuantity = lineItem.fulfillable_quantity;
    returnObj.fulfillmentService = lineItem.fulfillment_service;
    returnObj.fulfillmentStatus = lineItem.fulfillment_status;
    //returnObj.allocatedQuantity = 0;
    returnObj.quantity = lineItem.quantity;
    //Haikal. Total_discount not always reliable. Use discount_allocations instead. original line is below
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
  returnObj.discountAllocations = JSON.stringify(lineItem.discount_allocations);
  returnObj.discountApplications = discountApps;
  returnObj.discountCodes = discountCodes;

  returnObj.price = lineItem.price;

  returnObj.currency = currency;
  // returnObj.refundedAt = lineItem.;
  // returnObj.refundedAmount = lineItem.;
  returnObj.weight = lineItem.grams;
  returnObj.weightUnit = 'grams';
  returnObj.createdAt = orderCreated;
  returnObj.updatedAt = orderUpdated;
  returnObj.shopifyId = lineItem.id;
  if (['completed', 'cancelled', 'refunded'].includes(orderStatus)) {
    returnObj.status = orderStatus;
    return [returnObj, null];
  }
  if ('productVariantId' in returnObj && orderFinancialStatus === 'paid') {
    if (returnObj.status === "received") returnObj.status = "pending purchase";
    return [returnObj, returnObj.productVariantId];
  }
  return [returnObj, null];
};

async function createOrderModel(order,webshop) {

  let order_source = '';
  if (order.source = 'shopify') {
    order_source = 'shopify'
  }
    let risk = '';
  
   //check if there is a fulfillment
   let fulfillmentId = null
   if(order.fulfillments.length > 0) {
     fulfillmentId = order.fulfillments[order.fulfillments.length-1].id
   }
 
  const reallocateVariants = [];

 const [status, fulfillmentStatus] = mapShopifyResponseToWareOrderStatuses(order.fulfillment_status, order.financial_status);
  const orderModel = {
    shopifyId: order.id,
    createdAt: order.created_at,
    deletedAt: null,
    updatedAt: order.updated_at || order.created_at,
    closedAt: order.closed_at,
    customerEmail: order.email,
    customerPhone: order.phone,
    note: order.note,
    noteAttributes : JSON.stringify(order.note_attributes),
    financialStatus: order.financial_status,
    paymentStatus: order.payment_status,
    currency: order.currency,
    priority: 1,
    totalDiscounts: order.total_discounts ?? 0.00,
    totalTax: order.total_tax ?? 0.00,
    totalDuties: order.original_total_duties_set?.shop_money?.amount ?? 0.00,
    subtotalPrice: order.subtotal_price ?? 0.00,
    totalPrice: order.total_price ?? 0.00,
    totalOutstanding: order.total_outstanding ?? 0.00,
    cancelledAt: order.cancelled_at,
    cancelledReason: order.cancel_reason,
    fulfillmentStatus:order.fulfillment_status,
    fulfillmentId,
    shopifyShippingLine: order.shipping_lines?.reduce((prev, curr) => (prev.concat(curr.code)), "") ?? null,
    status,
    source: order_source,
    webshop: webshop,
    orderNumber: order.name,
    sourceUrl: order.source_url,
    // risk : risk
  };

  if ((order.tags ?? '') !== '') {
    orderModel.tags = order.tags.split(',').map((tg) => tg.trim()).toString();
  }
  if (order.customer) {
    orderModel.customerFirstName = order.customer.first_name;
    orderModel.customerLastName = order.customer.last_name;
  }

  if (order.billing_address) {
    orderModel.billingFirstName = order.billing_address.first_name;
    orderModel.billingLastName = order.billing_address.last_name;
    orderModel.billingPhone = order.billing_address.phone;
    orderModel.billingAddressLineOne = order.billing_address.address1;
    if (order.billing_address.address2) {
      orderModel.billingAddressLineTwo = order.billing_address.address2;
    }
    orderModel.billingAddressCity = order.billing_address.city;
    orderModel.billingAddressProvince = order.billing_address.province;
    orderModel.billingAddressCountry = order.billing_address.country;
    orderModel.billingAddressZip = order.billing_address.zip;
    
    if (order.billing_address.company)
      orderModel.billingCompany = order.billing_address.company;
  }
  
  if (order.shipping_address) {
    orderModel.addressFirstName = order.shipping_address.first_name;
    orderModel.addressLastName = order.shipping_address.last_name;
    orderModel.addressPhone = order.shipping_address.phone;
    orderModel.addressLineOne = order.shipping_address.address1;
    if (order.shipping_address.address2) {
      orderModel.addressLineTwo = order.shipping_address.address2;
    }
    orderModel.addressCity = order.shipping_address.city;
    orderModel.addressProvince = order.shipping_address.province;
    orderModel.addressCountry = order.shipping_address.country;
    orderModel.addressZip = order.shipping_address.zip;

    if (order.shipping_address.company)
      orderModel.companyName = order.shipping_address.company;
    
  }
  const discountApps = JSON.stringify(order.discount_applications);
  const discountCodes = JSON.stringify(order.discount_codes);

  //Discounts
  orderModel.discountApplications = discountApps; 
  orderModel.discountCodes = discountCodes;

  // let refunds = order.refunds ? order.refunds : []
  const refundss_array = order.refunds ? order.refunds.flatMap(x => x.refund_line_items.map(y => y)) : []
  // const refunds_array_lineItem = refundss_array.flatMap(l => l.line_item_id)

  const result = await Promise.all(order.line_items.map((lineItem) => (
    createLineItem(lineItem, order.created_at, order.updated_at, order.currency, orderModel.status, orderModel.financialStatus, orderModel,refundss_array, discountApps, discountCodes)
  )));

  const lineItems = [];

  result.forEach(([lineItem, variant]) => {
    if (variant) reallocateVariants.push(variant);
    if (lineItem) lineItems.push(lineItem);
  });

  orderModel.lineItems = lineItems;
  
  const shippingLines = [];

//   for(let b=0; b < order.shipping_lines.length; b++){
//     const line = createShippingLine(order.shipping_lines[b], order.created_at, order.updated_at, order.name, discountApps, discountCodes);    
//     shippingLines.push(line);
//   }
   
//   orderModel.shippingLines = shippingLines;

  return [orderModel, reallocateVariants];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default createOrderModel;
