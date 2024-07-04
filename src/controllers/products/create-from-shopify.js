import { domainToSubDomain,subDomainMap } from '../utilities/shop-mapper.js'
import Shopify from '../apis/shopify.js';
import axios from 'axios';

  async function getCostPrice(details, inventoryId) {
    let store = details.webshop;
    let key = details.api;
  
   // console.log(details);
  
    let url = `https://${store}.myshopify.com/admin/api/2024-04/inventory_items.json?ids=${inventoryId}`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          'X-Shopify-Access-Token': key,
        },
      });
  
      //console.log(response.data.inventory_items[0]);
      let costprice = response.data.inventory_items[0].cost;
     // console.log(costprice);
      return costprice; // Return the costprice here
    } catch (err) {
      console.log(err);
      return null; // Return a default value or handle the error appropriately
    }
  }

  async function createProductModel(req)  {
    const { body: product } = req

    const { 'x-shopify-shop-domain': domain } = req.headers
    const domainInformation = subDomainMap(domainToSubDomain(domain))
    const webshop = domainInformation.name
    const { [domainInformation.apiKey] : apiKey } = process.env
    let details = {
      webshop : webshop,
      api : apiKey
    }

    async function getVariantsMapped(product, details, webshop) {
      const variantsMapped = await Promise.all(product.variants.map(async (variant) => {
        const cost_price = await getCostPrice(details, variant.inventory_item_id);
        // console.log('cost_price',cost_price);
        
        return {
          webshop,
          cost_price,
          product_id: product.id,
          id: variant.id,
          title: variant.title,
          created_at: new Date(variant.created_at),
          updated_at: new Date(variant.updated_at),
          last_ordered_at: new Date(),
          admin_graphql_api_id: variant.admin_graphql_api_id,
          price: variant.price,
          sku: variant.sku,
          position: variant.position,
          compare_at_price: variant.compare_at_price,
          fulfillment_service: variant.fulfillment_service,
          inventory_management: variant.inventory_management,
          option1: variant.option1,
          option2: variant.option2,
          option3: variant.option3,
          taxable: variant.taxable,
          barcode: variant.barcode,
          grams: variant.grams,
          image_id: variant.image_id,
          weight: variant.weight,
          weight_unit: variant.weight_unit,
          inventory_item_id: variant.inventory_item_id,
          inventory_quantity: variant.inventory_quantity,
          old_inventory_quantity: variant.old_inventory_quantity,
          requires_shipping: variant.requires_shipping,
        };
      }));
      
      return variantsMapped;
    }

    let variantsMapped = await getVariantsMapped(product, details, webshop);

      const shopify = new Shopify(domainInformation.name, process.env[domainInformation.apiKey])
      const { inventory_items } = (
        await shopify.retrieveInventoryItems({
          ids: variantsMapped.map((variant) => variant.inventory_item_id).join(','),
        })
      ).data
    
      const inventoryItemsMapped = await inventory_items.map((inventoryItem) => ({
        id: inventoryItem.id,
        variant_id: variantsMapped.find((v) => v.inventory_item_id === inventoryItem.id)?.id || 0,
        webshop: webshop,
        cost: inventoryItem.cost || '0',
        country_code_of_origin: inventoryItem.country_code_of_origin,
        country_harmonized_system_codes: inventoryItem.country_harmonized_system_codes || [],
        created_at: new Date(inventoryItem.created_at),
        harmonized_system_code: inventoryItem.harmonized_system_code,
        province_code_of_origin: inventoryItem.province_code_of_origin,
        sku: inventoryItem.sku || '',
        tracked: inventoryItem.tracked,
        updated_at: new Date(inventoryItem.updated_at),
        requires_shipping: inventoryItem.requires_shipping,
      }))
    

    const productModel = {
        webshop,
        id: product.id,
        title: product.title,
        created_at: new Date(product.created_at),
        updated_at: new Date(product.updated_at),
        published_at: new Date(product.published_at),
        last_ordered_at: new Date(),
        admin_graphql_api_id: product.admin_graphql_api_id,
        vendor: product.vendor,
        body_html: product.body_html,
        product_type: product.product_type,
        handle: product.handle,
        status: product.status,
        template_suffix: product.template_suffix,
        published_scope: product.published_scope,
        tags: product.tags,
    };
   
   productModel.variants = await variantsMapped;
  //  console.log(variantsMapped);
   
   //productModel.variants = await getVariantsMapped(product, details, webshop);
   productModel.inventory = await inventoryItemsMapped
   
    
    return  productModel;
    
    
  }
  
  export default createProductModel;
  