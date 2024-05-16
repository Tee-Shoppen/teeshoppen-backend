import Shopify from '../apis/shopify.js'
import ProgressBar, { SingleBar } from 'cli-progress'
import {
  insertManyCollections,
  insertManyProducts,
  insertManyVariants,
  insertOrder,
  insertOrderLineItem,
  insertManyOrders,
  insertManyOrderLineItems,
  insertManyInventoryitems,
} from '../../database/queries.js'
import { subDomainMap } from '../utilities/shop-mapper.js'
import createOrderModel from '../orders/create-order.js'
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

// Helper function
const domainInformation = (subDomain) => {
  const subDomainInfo = subDomainMap(subDomain)

  console.log(subDomainInfo);

  const { [subDomainInfo.apiKey] : apiKey } = process.env

  if (!apiKey) {
    throw new Error('API key not provided.')
  }
 
  else return { ...subDomainInfo, api: apiKey }
}

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

const createProgressBar = (title) => {
  return {
    single: new ProgressBar.SingleBar(
      {
        format: `${title} {value}/{total} | {bar} | {percentage}% | ETA: {eta}s`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        barsize: process.stdout.columns > 140 ? 100 : 40,
        hideCursor: true,
        fps: 60,
      },
      ProgressBar.Presets.shades_classic
    ),
    multiple: new ProgressBar.MultiBar(
      {
        format: `{title} {value}/{total} | {bar} | {percentage}% | ETA: {eta}s`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        barsize: process.stdout.columns > 140 ? 100 : 40,
        hideCursor: true,
        fps: 60,
      },
      ProgressBar.Presets.shades_classic
    ),
  }
}

const getPageInfo = (link) => {
  if (!link) return undefined
  const next_link = link.split(',').find((page) => page.includes('next'))

  if (!next_link) return undefined
  const next_url = next_link.match(/<([^>]+)>; rel="(\w+)"/) 
  ? next_link.match(/<([^>]+)>; rel="(\w+)"/)[1] 
  : undefined;

  if (!next_url) return undefined
  const page_info = new URL(next_url).searchParams.get('page_info')

  if (!page_info) return undefined
  return page_info
}

const insertMany = async (array,insert) => {
  const batchSize = 250
  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize)
    await insert(batch)
  }
}

// Download

const downloadProducts = async (shopify , progressBar) => {
  const { count: productCount } = (await shopify.retrieveProductsCount()).data
  const productsDownloaded = []

  const params = { page_info: undefined, limit: 250 }
  progressBar.start(productCount, 0)

  do {
    const { data, headers } = await shopify.retrieveProducts(params)
    const { products } = data
    productsDownloaded.push(...products)
    params.page_info = getPageInfo(headers.link)
    progressBar.update(productsDownloaded.length)
  } while (params.page_info)
  progressBar.stop()

  return productsDownloaded
}

const downloadOrders = async (shopify , progressBar) => {
    const { count: ordersCount } = (await shopify.retrieveOrdersCount()).data
    const ordersDownloaded = []
  
    const params = { page_info: undefined, limit: 250 }
    progressBar.start(ordersCount, 0)
  
    do {
      const { data, headers } = await shopify.retrieveOrders(params)
      const { orders } = data
      ordersDownloaded.push(...orders)
      params.page_info = getPageInfo(headers.link)
      progressBar.update(ordersDownloaded.length)
    } while (params.page_info)
    progressBar.stop()
  
    return ordersDownloaded
  }

const downloadCollects = async (shopify, progressBar) => {
  const { count: collectsCount } = (await shopify.retrieveCollectsCount()).data
  const collectsDownloaded= []

  const params = { page_info: undefined, limit: 250 }
  progressBar.start(collectsCount, 0)

  do {
    const { data, headers } = await shopify.retrieveCollects(params)
    const { collects } = data
    collectsDownloaded.push(...collects)
    params.page_info = getPageInfo(headers.link)
    progressBar.update(collectsDownloaded.length)
  } while (params.page_info)
  progressBar.stop()

  return collectsDownloaded
}

const downloadCollections = async (collect, shopify, progressBar) => {
  const collectionIds = Array.from(new Set(collect.map((collect) => collect.collection_id)))
  const collectionsDownloaded = []

  progressBar.start(collectionIds.length, 0)

  for (const collection_id of collectionIds) {
    const { data } = await shopify.retrieveSingleCollection(collection_id)
    const { collection } = data
    collectionsDownloaded.push(collection)
    progressBar.update(collectionsDownloaded.length)
  }
  progressBar.stop()

  return collectionsDownloaded
}

const downloadInventoryItems = async (variants, shopify, progressBar) => {
  const inventoryitemsDownloaded= []

  progressBar.start(variants.length, 0)
  let counter = 0
  let inventory_item_ids = []

  for (const { inventory_item_id } of variants) {
    if (inventory_item_ids.length === 100) {
      const { inventory_items } = (await shopify.retrieveInventoryItems({ ids: inventory_item_ids.join(',') })).data
      inventoryitemsDownloaded.push(...inventory_items)
      progressBar.update(inventoryitemsDownloaded.length)
      inventory_item_ids = []
    } else {
      inventory_item_ids.push(inventory_item_id)
      counter++
    }
  }
  progressBar.stop()

  return inventoryitemsDownloaded
}

// Parse to Database
const parseProductsToDatabase = (webshop, productsDownloaded) => {
  return {
    products: productsDownloaded.map((product) => ({
      id: product.id,
      webshop: webshop,
      title: product.title,
      created_at: new Date(product.created_at),
      updated_at: new Date(product.updated_at),
      published_at: new Date(product.published_at || new Date()),
      last_ordered_at: new Date(),
      admin_graphql_api_id: product.admin_graphql_api_id,
      //collection_id: null,
      vendor: product.vendor,
      body_html: product.body_html,
      product_type: product.product_type,
      handle: product.handle,
      status: product.status,
      template_suffix: product.template_suffix,
      published_scope: product.published_scope,
      tags: product.tags,
      variants : product.variants.map(v => ({...v, webshop : webshop}))
    })),
    variants: productsDownloaded.flatMap((product) =>
      product.variants.map((variant) => ({
        id: variant.id,
        webshop: webshop,
        title: variant.title,
        created_at: new Date(variant.created_at),
        updated_at: new Date(variant.updated_at),
        last_ordered_at: new Date(),
        admin_graphql_api_id: variant.admin_graphql_api_id,
        product_id: product.id,
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
      }))
    ),
  }
}

const parseInventoryItemsToDatabase = (
  webshop,
  variantsDownloaded,
  inventoryItemsDownloaded
) => {
  return {
    inventoryItems: inventoryItemsDownloaded.map((inventoryItems) => ({
      id: inventoryItems.id,
      variant_id: variantsDownloaded.find((v) => v.inventory_item_id === inventoryItems.id)?.id || 0,
      webshop: webshop,
      cost: inventoryItems.cost || '0',
      country_code_of_origin: inventoryItems.country_code_of_origin,
      country_harmonized_system_codes: inventoryItems.country_harmonized_system_codes || [],
      created_at: new Date(inventoryItems.created_at),
      harmonized_system_code: inventoryItems.harmonized_system_code,
      province_code_of_origin: inventoryItems.province_code_of_origin,
      sku: inventoryItems.sku || '',
      tracked: inventoryItems.tracked,
      updated_at: new Date(inventoryItems.updated_at),
      requires_shipping: inventoryItems.requires_shipping,
    })),
  }
}

const parseCollectionsToDatabase = (webshop, collectionsDownloaded) => {
  return {
    collections: collectionsDownloaded.map((collection) => ({
      id: collection.id,
      webshop: webshop,
      handle: collection.handle,
      title: collection.title,
      updated_at: new Date(collection.updated_at),
      body_html: collection.body_html,
      published_at: new Date(collection.published_at),
      sort_order: collection.sort_order,
      template_suffix: collection.template_suffix,
      published_scope: collection.published_scope,
      admin_graphql_api_id: collection.admin_graphql_api_id,
    })),
  }
}

// Parse to Database
const parseOrdersToDatabase = async (webshop, ordersDownloaded) => {

    return{
        orders :  await ordersDownloaded.map(async order => {
               await createOrderModel(order,webshop)
        
        }),
        orderLineItems : await ordersDownloaded.map(async order => {
            let li = await createOrderModel(order,webshop)
            li.lineItems
        }),
    }

  }

// Migration
const all = async (subDomain) => {
  // initialize
  console.clear()
  const { name, country, api } = domainInformation(subDomain)
  const shopify = new Shopify(name, api)

  // Download
  const b1products = createProgressBar(capitalize(`Downloaded ${country} Products`)).single
  const productsDownloaded = await downloadProducts(shopify, b1products)

  const b1collects = createProgressBar(capitalize(`Downloaded ${country} Collects`)).single
  const collectsDownloaded = await downloadCollects(shopify, b1collects)

  const b1collections = createProgressBar(capitalize(`Downloaded ${country} Collections`)).single
  const collectionsDownloaded = await downloadCollections(collectsDownloaded, shopify, b1collections)

//   const b1Orders = createProgressBar(capitalize(`Downloaded ${country} Orders`)).single
//   const ordersDownloaded = await downloadOrders(shopify, b1Orders)

  // Parse
  const { products: toDatabaseProducts, variants: toDatabaseVariants } = parseProductsToDatabase(name, productsDownloaded)
  const { collections: toDatabaseCollections } = parseCollectionsToDatabase(name, collectionsDownloaded)
  //const { orders: toDatabaseOrders, orderLineItems: toDatabaseOrderLineItems } = await parseOrdersToDatabase(name, ordersDownloaded)

  // Insert
  const insertProgressBar = createProgressBar(capitalize(`Inserted ${country} Products`)).multiple
  const b2products = insertProgressBar.create(toDatabaseProducts.length, 0)
  const b2variants = insertProgressBar.create(toDatabaseVariants.length, 0)
  const b2collections = insertProgressBar.create(toDatabaseCollections.length, 0)
//   const b2orders = insertProgressBar.create(toDatabaseOrders.length, 0)
//   const b2orderlineitems = insertProgressBar.create(toDatabaseOrderLineItems.length, 0)

  let counterInsertProducts = 0
  let counterInsertVariants = 0
  let counterInsertCollections = 0
  let counterInsertOrders = 0
  let counterInsertOrderLineItems = 0

  const insertProductsPromise = insertMany(toDatabaseProducts, async (batch) => {
    await insertManyProducts(batch).then((p) => {
      // counterInsertProducts += p.rowsAffected
      // b2products.update(counterInsertProducts, {
      //   title: 'Insert Products',
      // })
    })
  })

  const insertVariantsPromise = insertMany(toDatabaseVariants, async (batch) => {
    //##########################
    // await insertManyVariants(batch).then((v) => {
    //   // counterInsertVariants += v.rowsAffected
    //   // b2variants.update(counterInsertVariants, {
    //   //   title: 'Insert Variants',
    //   // })
    // })
  })

  const insertCollectionsPromise = insertMany(toDatabaseCollections, async (batch) => {
    // #############################
    await insertManyCollections(batch).then((c) => {
      // counterInsertCollections += c.rowsAffected
      // b2collections.update(counterInsertCollections, {
      //   title: 'Insert Collections',
      // })
    })
  })

//   const insertOrdersPromise = insertMany(toDatabaseOrders, async (batch) => {
//     await insertManyOrders(batch).then((p) => {
//       // counterInsertProducts += p.rowsAffected
//       // b2products.update(counterInsertProducts, {
//       //   title: 'Insert Products',
//       // })
//     })
//   })

//   const insertOrderLineItemsPromise = insertMany(toDatabaseOrderLineItems, async (batch) => {
//     await insertManyVariants(batch).then((v) => {
//       // counterInsertVariants += v.rowsAffected
//       // b2variants.update(counterInsertVariants, {
//       //   title: 'Insert Variants',
//       // })
//     })
//   })

  //await Promise.all([insertProductsPromise, insertVariantsPromise,insertCollectionsPromise])
  await Promise.all([insertProductsPromise,insertCollectionsPromise])
  insertProgressBar.stop()
  console.log('Migration completed.')
}

const variants = async (subDomain) => {
  // initialize
  const { name, api } = domainInformation(subDomain)
  const shopify = new Shopify(name, api)

  // Download
  const b1products = createProgressBar(capitalize(`Downloaded ${name} Products`)).single
  const productsDownloaded = await downloadProducts(shopify, b1products)

  // Parse
  const { variants: toDatabaseVariants } = parseProductsToDatabase(name, productsDownloaded)

  // Insert
  const b2variants = createProgressBar(capitalize(`Inserted ${name} Products`)).single
  b2variants.start(toDatabaseVariants.length, 0)

  let counterInsertVariants = 0
  const insertVariantsPromise = insertMany(toDatabaseVariants, async (batch) => {
    await insertManyVariants(batch).then((v) => {
      // counterInsertVariants += v.rowsAffected
      // b2variants.update(counterInsertVariants, {
      //   title: 'Insert Variants',
      // })
    })
  })
  await Promise.all([insertVariantsPromise])

  b2variants.stop()
  console.log('Migration completed.')
}

const inventoryItems = async (subDomain) => {
  // initialize
  const { name, api } = domainInformation(subDomain)
  const shopify = new Shopify(name, api)

  // Download
  const b1products = createProgressBar(capitalize(`Downloaded ${name} Products`)).single
  const productsDownloaded = await downloadProducts(shopify, b1products)

  const variantsDownloaded = productsDownloaded.flatMap(({ variants }) => variants)

  const b2inventoryItems = createProgressBar(capitalize(`Downloaded ${name} Inventory Items`)).single
  const inventoryItemsDownloaded = await downloadInventoryItems(variantsDownloaded, shopify, b2inventoryItems)
  
  // Parse
  const { inventoryItems: toDatabaseInventoryItems } = parseInventoryItemsToDatabase(
    name,
    variantsDownloaded,
    inventoryItemsDownloaded
  )
  console.log(toDatabaseInventoryItems);

  //  // Insert
  const b3inventoryItems = createProgressBar(capitalize(`Inserted ${name} Inventory Items`)).single
  b3inventoryItems.start(toDatabaseInventoryItems.length, 0)

  let counterInsertInventoryItems = 0

  const insertInventoryItemsPromise = insertMany(toDatabaseInventoryItems, async (batch) => {
    setTimeout(async () => {
      await insertManyInventoryitems(batch).then((i) => {
        
        // counterInsertInventoryItems += i.rowsAffected
        // b3inventoryItems.update(counterInsertInventoryItems, {
        //   title: 'Insert Inventory Items',
        // })
      })
    }, 3000)
  })
  await Promise.all([insertInventoryItemsPromise])

  b3inventoryItems.stop()
  console.log('Migration completed.')
}

export { all, variants, inventoryItems }
