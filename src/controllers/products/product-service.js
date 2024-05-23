//@ts-check
import { InventoryItem, Product, Variant } from "../../database/postgresdb.js";
import { updateInventoryItem } from "../../database/queries.js";
import generateProductDescriptionSingle from "../descriptionAI/generateSingle.js";


async function putProductIncludesVariants(incoming) {
  let productId = null;

  /**
   * PUT Product && PUT Variants
   */

  // PUT Product
  try {
    //productId = await putProduct(incoming, t);
    let a = incoming;
    productId = await putProduct(incoming);
    if(productId){
      //await Promise.all(incoming.variants.map((v) => putVariant(v, incoming.images, productId, t)));
      await Promise.all(a.variants.map((v) => putVariant(v)));
    }    
  } catch (err) {
    console.error('putProductIncludesVariants error:', err);
    //return t.rollback();
  }
  //return t.commit();
}


//async function putProduct(incoming, trans) {
async function putProduct(incomingProduct) {
  //const t = trans ? trans : await sequelize.transaction();

//   delete incomingProduct.variants;
//   delete incomingProduct.inventory;

  const product = await Product.findOne({ where: { id: incomingProduct.id } });
  if (product){
    //check if the status is changing from draft to active
    let oldStatus = product.getDataValue('status');
    let incomingStatus = incomingProduct.status;
   await product.update({ ...incomingProduct });
   if ((oldStatus != 'active') && (incomingStatus == 'active') && (incomingProduct.body_html.length < 500)) {
    //generate desc if all are true
    await generateProductDescriptionSingle(incomingProduct.id);
  }
 
    for (const inventoryItemMapped of incomingProduct.inventory) {
      await updateInventoryItem(inventoryItemMapped.id, inventoryItemMapped);
   }

    return product.getDataValue("id");
  }
    
  return null;
}

/**
 * - Find Variant with shopify Id
 * - If found --> update it
 * - Else     --> create a new one
 */
//async function putVariant(incoming, productImages, productId, trans) {
async function putVariant(incomingVar) {  
  //const t = trans ? trans : await sequelize.transaction();
  const mappedVariant = incomingVar;

  const variant = await Variant.findOne({ where: { id: mappedVariant.id } });

  if (variant) {
    //await variant.update({ ...mappedToWareVariant }, { transaction: t });
    await variant.update({ ...mappedVariant });
  } else {
    //await ProductVariant.create({ ...mappedToWareVariant, ...extend }, { transaction: t });
    await Variant.create({ ...mappedVariant});
  }
}

export { putProductIncludesVariants };
