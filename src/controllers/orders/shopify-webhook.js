/* eslint-disable no-underscore-dangle */
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import orderCreation from "./create.js";
import { Order, OrderLineItem } from "../../database/postgresdb.js";
import createOrderModel from "./create-order.js";
import { insertOrder } from "../../database/queries.js";
import { domainToSubDomain, subDomainMap } from "../utilities/shop-mapper.js";
import axios from "axios";

const shopifyWebhook = async (req, res, next) => {
  const { 'x-shopify-topic': topic } = req.headers
  const { 'x-shopify-shop-domain': domain } = req.headers
  const { body : data} = req
  const domainInformation = subDomainMap(domainToSubDomain(domain))
  const webshop = domainInformation.name


  switch (topic) {
    case 'orders/create': {
      console.log("TRACE orders/create webhook starts");
     // console.log("TRACE create new product", data);
      res.sendStatus(200);
      let ord = data.id;
      console.log('data.id', data.id);
            try {

                await Order.findOne({ where : {id : data.id}})
                .then((isOrder) => {
                  if(isOrder) {
                    console.log('Order already exists');
                    return;
                  }
            })
                // Run the SQL query
                console.log('CREATING Order..')
                let mapped = await createOrderModel(data,webshop);
                console.log("////////////////////////////-----tags----------",mapped);
                await insertOrder(mapped);
                console.log("TRACE order/create webhook ends");
                //trigger webhook
                const webhookUrl = 'https://hook.eu1.make.com/jcc3nyoa2jmm7wyep9lkj1nz3cqdi79m';
                const orderDetails = {
                  orderId: ord 
                };
                try {
                  const response = await axios.post(webhookUrl, orderDetails, {
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
              
                  console.log('Response from Make.com:', response.data);
                } catch (error) {
                  console.error('Error triggering Make.com scenario:', error);
                }
                return;
          
            } catch (error) {
                console.error('shopify-webhook/orders/create - Error running query:', error);
                return;
            }
       
    }
    // case 'orders/updated': {
    //   console.log("TRACE orders/update webhook starts");
    //   res.sendStatus(200);
    //         try {
    //             // Run the SQL query
    //             console.log('UPDATE WEBHOOK - CREATING NEW ORDER ROW..')
    //             Order.findOne(
    //               {
    //                  where: {id: req.body.id},
    //                  include: [ 
    //                    {
    //                      model: OrderLineItem,
    //                      as: 'lineItems',
    //                    },
    //                  ]
    //               }
    //              ).then(async( resOrder) => {
    //               if (!resOrder) {
    //                 console.log('shopify-webhook/orders/update || orders/update cannot find id');
    //                 return;
    //               }
    //                 // const model = await updateOrderModel(data);  old
    //                 const model = await createOrderModel(data,webshop);
    //                 //console.log(model)
    //                 // console.log('found resv',resV)
    //                 // resV.lineItems.order_line_item[0] = model.lineItems
    //                 let lineItem_array = []
    //                 for await (let lT of model.lineItems) {
    //                   lineItem_array.push(lT.id)
    //                   // resV.lineItems = lT
    //                   // resV.set(model)
    //                   await OrderLineItem.findOne({where:{id:lT.id}}).then(async founditem => {
    //                     if (founditem) {
    //                         founditem.set(lT)
    //                         await founditem.save()
    //                     } else {
    //                       lT.order_id = resOrder.id
    //                       await OrderLineItem.create(lT)
    //                     }
    //                   })
    //                 }
    //                 await OrderLineItem.findAll({where:{order_id:resOrder.id}}).then(async orderLT => {
    //                   orderLT.flatMap(async olt => {
    //                     const newShopify = olt.id + 775;
    //                     if (!lineItem_array.includes(olt.id)) {
    //                       await OrderLineItem.update({id:newShopify},{where : {id: olt.id}});
    //                       OrderLineItem.destroy({ where: { id: newShopify }, returning:true })
    //                     }
    //                   })    
    //                 })
                                
    //                 //hotfix for removed  billingAddressLineTwo, addressLineTwo
    //                 if(resOrder.billingAddressLineTwo && !model.billingAddressLineTwo){
    //                   model.billingAddressLineTwo = "";
    //                 }
        
    //                 if(resOrder.addressLineTwo && !model.addressLineTwo){
    //                   model.addressLineTwo = "";
    //                 }
        
    //                 // resV.set(model)
    //                 await resOrder.update(model)
    //                 .then(async (saved) => {
    //                   console.log('saved from update');
          
        
    //                 })
    //                 .catch(err => {
    //                   console.log(err)
    //                 })
                

    //              })
    //             //await orderCreation(req);
    //             console.log("TRACE order/update - create webhook ends");
    //             return;
          
    //         } catch (error) {
    //             console.error('shopify-webhook/orders/update - Error running query:', error);
    //             return
    //         }
    //   }

    case 'orders/updated': {
      console.log("TRACE orders/update webhook starts");
      res.sendStatus(200);

      try {
        // Find the order by Shopify id
        const resOrder = await Order.findOne({
          where: { id: req.body.id },
          include: [
            {
              model: OrderLineItem,
              as: 'lineItems',
            },
          ],
        });

        if (!resOrder) {
          console.log('shopify-webhook/orders/update || orders/update cannot find id');
          return;
        }

        // Build new order model from Shopify payload
        const model = await createOrderModel(req.body, webshop);

        // Handle missing address fields
        if (resOrder.billingAddressLineTwo && !model.billingAddressLineTwo) {
          model.billingAddressLineTwo = "";
        }
        if (resOrder.addressLineTwo && !model.addressLineTwo) {
          model.addressLineTwo = "";
        }

        // Helper: only allow specific line item fields to be updated
        const pickLineItemFields = (li) => ({
          order_id: resOrder.id,
          title: li.title,
          quantity: li.quantity,
          price: li.price,
          sku: li.sku,
          variant_id: li.variant_id,
          grams: li.grams,
          taxable: li.taxable,
          // add more safe fields if needed
        });

        await Order.sequelize.transaction(async (t) => {
          // 1) Update the order itself (exclude id)
          await resOrder.update(
            {
              email: model.email,
              phone: model.phone,
              financialStatus: model.financialStatus,
              fulfillmentStatus: model.fulfillmentStatus,
              currency: model.currency,
              subtotalPrice: model.subtotalPrice,
              totalPrice: model.totalPrice,
              shippingAddress: model.shippingAddress,
              billingAddress: model.billingAddress,
              addressLineTwo: model.addressLineTwo,
              billingAddressLineTwo: model.billingAddressLineTwo,
              // whitelist other fields you allow to update
            },
            { transaction: t }
          );

          // 2) Sync line items
          const incoming = Array.isArray(model.lineItems) ? model.lineItems : [];
          const keepIds = new Set(incoming.map((li) => li.id)); // assumes Shopify line_item.id is your PK

          for (const li of incoming) {
            const existing = await OrderLineItem.findOne({
              where: { id: li.id },
              transaction: t,
            });

            if (existing) {
              await existing.update(pickLineItemFields(li), { transaction: t });
            } else {
              await OrderLineItem.create(
                { id: li.id, ...pickLineItemFields(li) },
                { transaction: t }
              );
            }
          }

          // 3) Delete any stale line items (no PK mutation)
          await OrderLineItem.destroy({
            where: {
              order_id: resOrder.id,
              id: { [Op.notIn]: Array.from(keepIds) },
            },
            transaction: t,
          });
        });

        console.log("TRACE order/update webhook ends");
        return;
      } catch (error) {
        console.error('shopify-webhook/orders/update - Error running query:', error);
        return;
      }
  }
 


    default:
    console.log('shopify-webhook', `Unexpected topic ${topic}`, 2);
    return;
  }
}

export default shopifyWebhook
