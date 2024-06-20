import dotenv from "dotenv";
// Import BigQuery module
// import { getBigQueryClient } from "./client.js";
dotenv.config({ path: "./.env" });
// Create a BigQuery client instance
// const bigquery = getBigQueryClient();
// Define the dataset ID
const datasetId = process.env.BIGQUERY_DATASET_ID;
import sequelize from "sequelize";
import sql from 'sequelize';
const { Op } = sql;
import { Order,OrderLineItem,Product,Variant,Collection,ProductText,InventoryItem } from "./postgresdb.js";
import { domainToSubDomain,subDomainMap } from "../controllers/utilities/shop-mapper.js";
import Shopify from "../controllers/apis/shopify.js";

// Define BigQuery tables
// const productsTable = bigquery.dataset(datasetId).table('products');
// const variantsTable = bigquery.dataset(datasetId).table('variants');
// const inventoryItemsTable = bigquery.dataset(datasetId).table('inventory_items');
// const collectionsTable = bigquery.dataset(datasetId).table('collections');
// const ordersTable = bigquery.dataset(datasetId).table('orders');
// const orderLineItemTable = bigquery.dataset(datasetId).table('order_line_items');
// const costPriceMonitoringTable = bigquery.dataset(datasetId).table('cost_price_monitoring');
// const productsTextTable = bigquery.dataset(datasetId).table('productText');

// Function to insert a product
const insertProduct = async (p) => {
  try{
    Product.create(p,
      {
        include: [{
          model: Variant,
          as: 'variants',
        }],
        returning: true,
      }
    ).then((resV) => {
      console.log('shopify-webhook/products/create || Created product successfully');
      console.log("TRACE product/create webhook ends in product.create()");
    })
    .catch((err) => {
      console.log('shopify-webhook/products/create', err.response?.data || err.stack || err.message || err.toString());
    });
  }
  catch (error) {
    console.error('Error inserting product:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
// Function to insert a product
const insertProductText = async (p) => {
  try {
    p.status = 'Need to review';
    await ProductText.insert(p);
    console.log('Product has been inserted to productText table.');
  } catch (error) {
    console.error('Error inserting product to productText:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// Function to insert a productDesc
const insertDescription = async (p) => {
  try {
    //check if product already exists
    let exists = await ProductText.findOne({where: {product_id : p.product_id}})
    if (exists) return;
    await ProductText.create(p)
    .then((textDesc) => {
      console.log('Product has been inserted to productText table.');
    })
    .catch(err => {
      console.log('insertDescription || ,', err);
    })
  } catch (error) {
    console.error('insertDescription || Error inserting product to productText:', error);
   // throw error; // Re-throw the error for handling by the caller
  }
};

// Function to get or create product metafield
const createMetaField = async (details) => {
  try {
    const { name, apiKey } = subDomainMap(details.webshop)
    const api = process.env[apiKey];
    const shopify = new Shopify(name, process.env[apiKey]);

      //create a metafield
      const desc_params = {
        "metafield": {
          "namespace": "global",
          "key": "description_tag",
          "value": details.desc,
          "type": "multi_line_text_field",
          "definition": {
            "name": "Meta description",
            "ownerType": "PRODUCT"
          }
        }
      }

      const title_params = {
        "metafield": {
          "namespace": "global",
          "key": "title_tag",
          "value": details.title,
          "type": "multi_line_text_field",
          "definition": {
            "name": "Meta title",
            "ownerType": "PRODUCT"
          }
        }
      }
      const {data  : metafieldDesc } = await shopify.createProductMetafield(details.id,desc_params);
      const {data  : metafieldtitle } =await shopify.createProductMetafield(details.id,title_params);

      const productText = await ProductText.findOne({ where: { product_id: details.id }});
      productText.meta_desc_id = metafieldDesc.metafield?.id || null;
      productText.meta_title_id = metafieldtitle.metafield?.id || null;
      productText.save();
  } catch (error) {
    console.error('Error running query:', error);
  }
};

// Function to update a productDesc
const updateMetaField = async (req,res,next) => {
  try {
    if(!req.body) return;
    const product = await ProductText.findOne({ where: { product_id: req.params.id }});
    const mainProduct = await Product.findOne({ where: { id: req.params.id }});
    if(!product) return;

    const { name, apiKey } = subDomainMap(mainProduct.webshop)
    const shopify = new Shopify(name, process.env[apiKey]);
 
    product.status = 'Done';
    product.updated_at = new Date();
    product.new_description = req.body.newDesc;
    product.new_title = req.body.seoTitle;
    product.new_seo_desc = req.body.seoDesc;
    res.sendStatus(200);

    await product.save().then(async() => {
      // res.sendStatus(200);
      const seoDescDetails = {
        "metafield": {
          "value": product.new_seo_desc
        }
      }
      const seoTitleDetails = {
        "metafield": {
          "value": product.new_title
        }
      }

      mainProduct.body_html = product.new_description;
      await mainProduct.save().then((saver) => {
        console.log('SAVED in database');
      })

      await shopify.updateProduct(req.params.id,{body_html :product.new_description});

      let ids = {};
      ids = {
        meta_id : product.meta_desc_id,
        product_id : req.params.id
      }
      const b = await shopify.updateProductMetafield(ids,seoDescDetails);
      ids = {
        meta_id : product.meta_title_id,
        product_id : req.params.id
      }
      const c= await shopify.updateProductMetafield(ids,seoTitleDetails);
    
    })
    // await product.update({ ...newProduct })
    // .then(async (newProd) => {
    //     await product.save();
    //     res.sendStatus(200);

    // })
    console.log('updateMetaField || Product has been updated in productText table and Shopify.');
  //    return product
     

  } catch (error) {
    console.error('Error running query:', error);
  }
};

// Function to update a productDesc
const updateBulkMetaField = async (req,res,next) => {
  try {
    let {ids :ids} = req.body;
    const products = await ProductText.findAll({ where: { product_id: { [Op.in] : ids}}});

    console.log(products.length);
    if(products.length < 1) {
      res.sendStatus(200);
      return;
    }

    if(products.length > 0) {
      res.sendStatus(200);
    }

    for await (var item of products) {
      let product = item.dataValues;
      const { name, apiKey } = subDomainMap(product.webshop)
      const shopify = new Shopify(name, process.env[apiKey]);
      const mainProduct = await Product.findOne({ where: { id: product.product_id }});

      item.setDataValue('status', 'Done');
      item.setDataValue('updated_at', new Date());
      item.setDataValue('new_description', product.new_description);
      item.setDataValue('new_title', product.new_title);
      item.setDataValue('new_seo_desc', product.new_seo_desc);

      // product.status = 'Done';
      // product.updated_at = new Date();
      // product.new_description = product.new_description;
      // product.new_title = product.new_title;
      // product.new_seo_desc = product.new_seo_desc;

      await item.save().then(async() => {
        // res.sendStatus(200);
        const seoDescDetails = {
          "metafield": {
            "value": product.new_seo_desc
          }
        }
        const seoTitleDetails = {
          "metafield": {
            "value": product.new_title
          }
        }
  
        mainProduct.body_html = product.new_description;
        await mainProduct.save().then((saver) => {
          console.log('SAVED in database');
        })
  
        await shopify.updateProduct(product.product_id,{body_html :product.new_description});
  
        let ids = {};
        ids = {
          meta_id : product.meta_desc_id,
          product_id : product.product_id
        }
        const b = await shopify.updateProductMetafield(ids,seoDescDetails);
        ids = {
          meta_id : product.meta_title_id,
          product_id : product.product_id
        }
        const c= await shopify.updateProductMetafield(ids,seoTitleDetails);
      
      })

      console.log('updateMetaField || Product has been updated in productText table and Shopify.');
     
    }
     
  } catch (error) {
    console.error('Error running query:', error);
  }
};

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
// Function to insert a variant
const insertVariant = async (v) => {
  try {
    await variantsTable.insert(v);
    console.log('Variant creation successful.');
  } catch (error) {
    console.error('Error inserting variant:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// Function to insert an inventory item
const insertInventoryitems = async (i) => {
  try {
   InventoryItem.create(i,
      {
        ignoreDuplicates : true
      }
    ).then(() => {
      console.log('Inventory items creation successful.');
    }).catch(err => {
      console.log('insertInventoryitems || error', err);
    })
    
  } catch (error) {
    console.error('Error inserting inventory item:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// Function to insert a collection
const insertCollection = async (c) => {
  try{
    Collection.create(c,
      {
      }
    ).then((resV) => {
      console.log('shopify-webhook/collection/create || Created collection successfully');
      console.log("TRACE collection/create webhook ends in collection.create()");
    })
    .catch((err) => {
      console.log('shopify-webhook/collection/create', err.response?.data || err.stack || err.message || err.toString());
    });
  } catch (error) {
    console.error('Error inserting collection:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// Function to insert multiple products
const insertManyProducts = async (p) => {
  try{
    Product.bulkCreate(p,
      {
        ignoreDuplicates: true,
        include: {
          model: Variant,
          as: 'variants',
          required: true,
          ignoreDuplicates: true,
        },
      }
    ).then((newProduct) => {
      console.log('Bulk Product created...');
    }).catch(err=> {
      console.log('ERROR creating bulk product', err)
    })
    
  }catch(error){
    console.error('Error inserting multiple products:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
// Function to insert multiple variants
const insertManyVariants = async (v) => {
  try {
    await variantsTable.insert(v);
  } catch (error) {
    console.error('Error inserting multiple variants:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// Function to insert multiple inventory items
const insertManyInventoryitems = async (i) => {
  try{
    InventoryItem.bulkCreate(i,
      {
        ignoreDuplicates: true,
      }
    ).then(() => {
      console.log('Bulk Inventory item created...');
    }).catch(err=> {
      console.log('ERROR creating bulk inventory', err)
    })
    
  }catch (error) {
    console.error('Error inserting multiple inventory items:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// Function to insert multiple collections
const insertManyCollections = async (c) => {
  try{
    Collection.bulkCreate(c,
      {
        ignoreDuplicates: true,
      }
    ).then((newCollection) => {
      console.log('Bulk Collection created...');
    }).catch(err=> {
      console.log('ERROR creating bulk collection', err)
    })
    
  } catch (error) {
    console.error('Error inserting multiple collections:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
// Function to retrieve a product by ID
const retrieveProduct = async (req, res, next) => {
    const query = `
    SELECT * FROM ${datasetId}.products where id=${req.params.id}`;

  try {
  //   // Run the SQL query
  //   const [rows] = await bigquery.query(query);

  // //    return product
  //     res.send({product:rows});

  } catch (error) {
    console.error('Error running query:', error);
  }
}

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
// Function to retrieve a product UPATEDAT by ID
const retrieveProductUpdatedAt = async (req, res, next) => {
  const query = `
  SELECT updated_at FROM ${datasetId}.products where id=${req.params.id}`;
try {
  // Run the SQL query
//   const [rows] = await bigquery.query(query);
//   let updatedAt = rows[0].updated_at? rows[0].updated_at.value : '';

// //    return product
//     res.send({value:updatedAt});

} catch (error) {
  console.error('Error running query:', error);
}
}

// Function to retrieve a variant by ID
const retrieveVariant = async (req,res,next) => {
  try {
  await Variant.findOne({where : { id : req.params.id }})
  .then((rows) => {
    res.send({variant:rows});
  })

  //    return product
      

  } catch (error) {
    console.error('Error running query:', error);
  }
};

// Function to retrieve an inventory item by ID
const retrieveInventoryItem = async (i_id) => {
  try {
    const [inventoryItem] = await InventoryItem.findOne({where : {id : i_id}})

    // const [inventoryItem] = await inventoryItemsTable.get(i_id);
    return inventoryItem;
  } catch (error) {
    console.error('Error retrieving inventory item:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
// Function to retrieve a collection by ID
const retrieveCollection = async (req,res,next)=> {
  const query = `
  SELECT * FROM ${datasetId}.collections where id=${req.params.id}`;

try {
  // Run the SQL query
//   const [rows] = await bigquery.query(query);

// //    return collection
//     res.send({collection:rows});

} catch (error) {
  console.error('Error running query:', error);
}
};

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
// Function to retrieve many products
const retrieveManyProducts = async (req, res, next) => {
    //const query = `
    //SELECT * FROM ${datasetId}.products limit ${req.query.pageSize} offset ${req.query.page}`;
    const query = `
    SELECT * EXCEPT(row_number)
    FROM (
          SELECT *, ROW_NUMBER()
                    OVER (PARTITION BY id, title
                          ORDER BY updated_at DESC) row_number
          FROM ${datasetId}.products) 
    WHERE row_number = 1 limit ${req.query.pageSize} offset ${req.query.page} ;
    `
  try {
    // Run the SQL query
//     const [rows] = await bigquery.query(query);

// //    return product
//       res.send({product:rows});

  } catch (error) {
    console.error('Error running query:', error);
  }
}

// Function to retrieve many products with < 500
const retrieveProductsforAI = async (req, res, next) => {

  let p;
  // 
  var attributes = ['id', 'title', 'body_html', 'webshop', 'vendor', 'tags'];

  try{
    // Run query
    await Product.findAndCountAll({
    where: {  
      [Op.and]: [
      sequelize.where(sequelize.fn('length', sequelize.col('body_html')), {
      [Op.lt]: 500,
    }),
    { status: 'active' }
   ]
  },
    ...(attributes ? { attributes } : undefined),
    paranoid: false,
    raw: true,
  })
    .then(async ({ rows, count}) => {
      // if (rows === null) {
      //   console.log('No product found with <500 bodyHTML');
      //   // next(nsew ValueNotFoundError(`Product ${id}`));
      //   return;
      // }
      //let product = await rows
      p= await rows;
      
      // systemLog('get-product ', `Get product ${product.id}`, 3);
     // res.data = { orders: rows, totalCount: count };
    })
    return p;
  // 
  // const query = `
  // SELECT id, title, body_html, webshop, vendor, tags
  // FROM (
  //       SELECT *, ROW_NUMBER()
  //                 OVER (PARTITION BY id, title) row_number
  //       FROM ${datasetId}.products) 
  // WHERE row_number = 1 and LENGTH(body_html) < 500;`
// try {
//   // Run the SQL query
//   const [rows] = await bigquery.query(query);
//   //    return product

//   return rows;

} catch (error) {
  console.error('Error running query:', error);
}
}

// Function to retrieve many products with < 500 for single product
const retrieveProductsforAISingle = async (id) => {
  let p;
  // 
  var attributes = ['id', 'title', 'body_html', 'webshop', 'vendor', 'tags'];

  try{
    // Run query
   // const mainProduct = await Product.findOne({ where: { id: req.params.id }});
    await Product.findOne({
    where: { id: id },
    ...(attributes ? { attributes } : undefined),
    paranoid: false,
    raw: true,
  })
    .then(async (rows) => {
      // if (rows === null) {
      //   console.log('No product found with <500 bodyHTML');
      //   // next(nsew ValueNotFoundError(`Product ${id}`));
      //   return;
      // }
      //let product = await rows
      p= await rows;
      console.log(p);
      
      // systemLog('get-product ', `Get product ${product.id}`, 3);
     // res.data = { orders: rows, totalCount: count };
    })
    return p;

} catch (error) {
  console.error('Error running query:', error);
}
}


// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
// Function to retrieve many variants
const retrieveManyVariants = async () => {
  try {
    const [variants] = await variantsTable.get();
    return variants;
  } catch (error) {
    console.error('Error retrieving many variants:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
// Function to retrieve many inventory items
const retrieveManyInventoryItems = async () => {
  try {
    const [inventoryItems] = await inventoryItemsTable.get();
    return inventoryItems;
  } catch (error) {
    console.error('Error retrieving many inventory items:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
// Function to retrieve many collections
const retrieveManyCollections = async (req,res,next) => {
  const query = `
  SELECT * FROM ${datasetId}.collections limit ${req.query.pageSize} offset ${req.query.page}`;

  try {
    // Run the SQL query
  //   const [rows] = await bigquery.query(query);

  // //    return collections
  //     res.send({collections:rows});

  } catch (error) {
    console.error('Error running query:', error);
  }
};

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
async function updateProduct(p_id, rowToUpdate) {
  try {
    // Retrieve existing table data (assuming ID uniquely identifies a row)
    const sql = `SELECT * FROM ${datasetId}.products WHERE id = ${p_id}`;
    const rows = await productsTable.query({  // Await the promise to get resolved value
      query: sql,
      parameters: {
        p_id,
      },
    });

    // Check if product exists
    if (!rows) {
      throw new Error('Product not found for update');
    }

    else{
      // Execute the update function with the sample data
    updateProduct_(rowToUpdate);

    return true; // Indicate successful update
    }

    // Function to construct the update SQL dynamically
    function buildUpdateSql(rowToUpdate) {
      const updateSql = `UPDATE \`${datasetId}.products\` SET `;

      let updateClause = '';
      for (let [key, value] of Object.entries(rowToUpdate)) {
         if (!value) {
          updateClause +=`${key} = null,`;
          rowToUpdate[`${key}`] = "null";
         }
         else {
          updateClause +=`${key} = @${key},`;
         }
          
      }

      // Remove the trailing comma from the update clause
      updateClause = updateClause.slice(0, -1);

     // return updateSql + updateClause + ` WHERE id = ${p_id} and timestamp < TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 90 MINUTE)`;
     return updateSql + updateClause + ` WHERE id = ${p_id}`;
    }

    async function updateProduct_(rowToUpdate) {
      rowToUpdate.variants ?? await delete rowToUpdate.variants;
      rowToUpdate.options ?? await delete rowToUpdate.options;
      rowToUpdate.images ?? await delete rowToUpdate.images;
      rowToUpdate.image ?? await delete rowToUpdate.image;
      rowToUpdate.variant_ids ?? await delete rowToUpdate.variant_ids;
      // Construct the update SQL based on the provided data
      const updateSql = buildUpdateSql(rowToUpdate);

      //console.log('updateSql -------------------- ',updateSql)
      // Prepare parameters object
      const parameters = {
        ...rowToUpdate,  // Include all properties from rowToUpdate
      };

      

      // // Execute the update query
      try {
        const options = {
          query: updateSql,
          // Location must match that of the dataset(s) referenced in the query.
          location: 'EU',
          params: parameters,
        };
        // const [queryResults] = await bigquery.query(options);
        // const [job] = await bigquery.createQueryJob(options);
        // console.log(`Job ${job.id} started.`);

        // Wait for the query to finish
       // const [rows] = await job.getQueryResults();

        console.log(`Product id ${p_id} updated.`);
      } catch (error) {
        console.error('Error during product update:', error);
      }
    }

    
  } catch (error) {
    
    console.error('Error updating row here:', error);
    throw error; // Re-throw the error for handling by the caller
  }
}

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
async function updateOrCreateVariant(rowToUpdate) {
  let variantRow = rowToUpdate.variants
  if (variantRow.length > 0) {
      variantRow.forEach(async variant => {
        try {
          // Retrieve existing table data (assuming ID uniquely identifies a row)
          const sql = `SELECT * FROM ${datasetId}.variants WHERE id = ${variant.id}`;
          const rows = await variantsTable.query({  // Await the promise to get resolved value
            query: sql,
            parameters: {
              id : variant.id,
            },
          });
      
          // Check if product exists
          if (!rows) {
            //create new row for variant
            await insertVariant(variant);
          } 
          else{
            updateVariant(variant);
            return true;
          }
      
          // Function to construct the update SQL dynamically
          function buildUpdateSql(variant) {
            const updateSql = `UPDATE \`${datasetId}.variants\` SET `;
      
            //console.log('variantRow', variant);

            let updateClause = '';
            for (const [key, value] of Object.entries(variant)) {
              if (!value) {
                updateClause +=`${key} = "null",`;
                variant[`${key}`] = "null";
               }
               else {
                updateClause +=`${key} = @${key},`;
               }
            }
      
            // Remove the trailing comma from the update clause
            updateClause = updateClause.slice(0, -1);
      
            return updateSql + updateClause + ` WHERE id = ${variant.id}`;
          }
      
          async function updateVariant(variant) {
            // Construct the update SQL based on the provided data
            const updateSql = buildUpdateSql(variant);

            console.log('updateSql', updateSql);

            // Prepare parameters object
            const parameters = {
              ...variant,  // Include all properties from rowToUpdate
            };
      
            // Execute the update query
            try {
              const options = {
                query: updateSql,
                // Location must match that of the dataset(s) referenced in the query.
                location: 'EU',
                params: parameters,
              };
              // const [queryResults] = await bigquery.query(options);
              console.log(`Variant id ${variant.id} updated.`);
            } catch (error) {
              // console.log('updateSql', updateSql);
              // console.log('parameters', parameters);
              console.error('Error during variant update:', error);
            }
          }
      
          // Execute the update function with the sample data
           // Indicate successful update
        } catch (error) {
          console.error('Error updating row here:', error);
          throw error; // Re-throw the error for handling by the caller
        }
      
    });
  } else {
    console.log('No variants received');
  }
}

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
async function updateVariant(v_id, rowToUpdate) {
  try {
    // Retrieve existing table data (assuming ID uniquely identifies a row)
    const sql = `SELECT * FROM ${datasetId}.variants WHERE id = ${v_id}`;
    const rows = await variantsTable.query({  // Await the promise to get resolved value
      query: sql,
      parameters: {
        v_id,
      },
    });

    // Check if product exists
    if (!rows) {
      throw new Error('Variant not found for update');
    } 
    else{
      updateVariant(rowToUpdate);
      return true;
    }

    // Function to construct the update SQL dynamically
    function buildUpdateSql(rowToUpdate) {
      const updateSql = `UPDATE \`${datasetId}.variants\` SET `;

      let updateClause = '';
      for (const [key, value] of Object.entries(rowToUpdate)) {
          updateClause += `${key} = @${key}, `;
        
      }

      // Remove the trailing comma from the update clause
      updateClause = updateClause.slice(0, -2);

      return updateSql + updateClause + ` WHERE id = ${v_id}`;
    }

    async function updateVariant(rowToUpdate) {
      // Construct the update SQL based on the provided data
      const updateSql = buildUpdateSql(rowToUpdate);

      // Prepare parameters object
      const parameters = {
        ...rowToUpdate,  // Include all properties from rowToUpdate
      };

      // Execute the update query
      try {
        const options = {
          query: updateSql,
          // Location must match that of the dataset(s) referenced in the query.
          location: 'EU',
          params: parameters,
        };
        // const [queryResults] = await bigquery.query(options);
        console.log(`Variant id ${v_id} updated.`);
      } catch (error) {
        console.error('Error during variant update:', error);
      }
    }

    // Execute the update function with the sample data
     // Indicate successful update
  } catch (error) {
    console.error('Error updating row here:', error);
    throw error; // Re-throw the error for handling by the caller
  }
 
}

// Function to update an inventory item by ID
async function updateInventoryItem(i_id, rowToUpdate) {
  try {
      // Retrieve existing data
      const existingData = await InventoryItem.findOne({where : {id : i_id}});

      if (!existingData) {
        console.error('No existing inventory found.');
        await insertInventoryitems(rowToUpdate);
      }

      else {
        const rowsToInsert = rowToUpdate;
        // Insert the modified data back into the table
        await existingData.update({...rowsToInsert});
        console.log('Inventory row updated successfully.');
      }

      
  } catch (error) {
      console.error('Error updating row:', error);
      throw error;
  }
}

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
// Function to update a collection by ID
async function updateCollection(c_id, rowToUpdate) {
  try {
      // Retrieve existing data
      const existingData = await retrieveCollection(c_id);

      // Find the index of the row to update
      const rowIndex = existingData.findIndex((row) => row.id === rowToUpdate.id);

      // If the row exists, update it
      if (rowIndex !== -1) {
          existingData[rowIndex] = rowToUpdate;
      } else {
          throw new Error('Row not found for update');
      }

      // Define the rows to insert, including the updated row
      const rowsToInsert = existingData.map((row) => ({ insertId: row.id, json: row }));

      // Insert the modified data back into the table
      await collectionsTable.insert(rowsToInsert, { ignoreUnknownValues: true });
      console.log('Collection row updated successfully.');
  } catch (error) {
      console.error('Error updating row:', error);
      throw error;
  }
}

// Function to insert an order
const insertOrder = async (o) => {
  try{
    Order.create(o,
      {
        include: [{
          model: OrderLineItem,
          as: 'lineItems',
        }],
        returning: true,
      }
    ).then((resV) => {
      console.log('shopify-webhook/orders/create || Created orders successfully');
      console.log("TRACE order/create webhook ends in order.create()");
    })
    .catch((err) => {
      console.log('shopify-webhook/order/create', err.response?.data || err.stack || err.message || err.toString());
      console.log('errrrr', err);
    });
  } catch (error) {
    console.error('Error inserting order:', JSON.stringify(error));
    throw error; // Re-throw the error for handling by the caller
  }
};

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
// Function to insert an order line item
const insertOrderLineItem = async (ol) => {
  try {
    await orderLineItemTable.insert(ol);
    console.log('Order line item creation successful.');
  } catch (error) {
    console.error('Error inserting order line item:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// Function to insert multiple orders
const insertManyOrders = async (p) => {
  console.log(p.length, 'ORDERS COUNT');
  try {
    Order.bulkCreate(p,
      {
        ignoreDuplicates: true,
        include: {
          model: OrderLineItem,
          as: 'lineItems',
          required: true,
          ignoreDuplicates: true,
        },
      }
    ).then((newOrder) => {
      console.log('Bulk orders created...');
    }).catch(err=> {
      console.log('ERROR creating bulk orders', err.message)
    })
  } catch (error) {
    console.error('Error inserting multiple orders:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
// Function to insert multiple orderLine ITEMS
const insertManyOrderLineItems = async (p) => {
  try {
    await orderLineItemTable.insert(p);
  } catch (error) {
    console.error('Error inserting multiple order line items:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
// Function to retrieve a order by ID
const retrieveOrder = async (req, res, next) => {
  const query = `
  SELECT * FROM ${datasetId}.orders where id=${req.params.id}`;

try {
  // Run the SQL query
//   const [rows] = await bigquery.query(query);

// //    return order
//     res.send({order:rows});

} catch (error) {
  console.error('Error running query:', error);
}
}

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
// Function to retrieve many orders
const retrieveManyOrders = async (req, res, next) => {
  const query = `
  SELECT * FROM ${datasetId}.products limit ${req.query.pageSize} offset ${req.query.page}`;

try {
  // Run the SQL query
//   const [rows] = await bigquery.query(query);

// //    return product
//     res.send({orders:rows});

} catch (error) {
  console.error('Error running query:', error);
}
}

// Function to retrieve many orders
const retrieveDelayedOrders = async (req, res, next) => {
  try {
    let now = new Date();
  const delayedOrders = await Order.findAll(
    { where: {
      fulfillment_status: { [Op.is] : null},
      created_at : {
        [Op.and] : [
          // { [Op.lte] : now },
          { [Op.gte] : sequelize.literal("now() - INTERVAL '24 HOURS'") },
        ]
      }
      // { fulfillment_status: { [Op.is] : null}},
      // { created_at : {[Op.lte] : now}  }
     },
     attributes : [
      'id',
      'order_number',
      [sequelize.fn('CONCAT', sequelize.col('customer_first_name'),' ',sequelize.col('customer_last_name')),'customer_name'],
      'webshop',
      'total_price',
      'created_at'

    ],
     include: [{
      model: OrderLineItem,
      as: 'lineItems',
      attributes : ['id','product_title','product_variant_id','product_id','price'],
      // include: [{
      //   model: Variant,
      //   as: 'variants',
      //   attributes : ['id','price','title','product_id'],
      //   include: [{
      //     model: Product,
      //     as: 'product',
      //     attributes : ['id','title','vendor','status'],
      //   }],
      // }],
    }],
    limit : 2
  });
  console.log(new Date());

  // let variants = [];
 

  if (delayedOrders.length < 1) return;
  //  for await (var order of delayedOrders) {
  //   // let orderObj = {};
  //   // orderObj.ordNumber = order.order_number
  //   let ctr = 0;
  //     for await (var items of order.lineItems) {
  //       variants.push(items.product_variant_id,orderObj);
  //     }
  //  }
  let r = 0;
  // await delayedOrders.map(async (order) => {
  //   await order.lineItems.map(async(item) => {
  //     //item.dataValues.b = "hee"
  //     // product_variant_id
  //     let products = [];
  //     await Variant.findOne({
  //     where : {
  //       id : item.product_variant_id
  //     },
  //     attributes : ['id','price','title','product_id'],
  //     include : [
  //       {
  //         model: Product,
  //         as: 'product',
  //         attributes : ['id','title','vendor','status']
  //       }
  //     ]
  //   }).then(async(variant) => {
  //     console.log('variant',variant.id)
  //       await products.push(variant);
  //   })
  //    item.dataValues.b = 'hoy';
  //   //await products.push(product);
   
  // })
  // r++;
  // console.log('r ', r);
  // if (r == '2') {
  //   res.send({orders:delayedOrders});
  //  }
  // })


  for (let x = 0; x < delayedOrders.length; x++) {
      for await (var item of delayedOrders[x].lineItems) {
        let products = [];
        await Variant.findOne({
        where : {
          id : item.product_variant_id
        },
        attributes : ['id','price','title','product_id','sku'],
        include : [
          {
            model: Product,
            as: 'product',
            attributes : ['id','title','vendor','status']
          }
        ]
      }).then(async(variant) => {
        //console.log('variant',variant.id)
        item.dataValues = {...item.dataValues, variant};
          //await products.push(variant);
      })
    
      
      //await products.push(product);
    }
    //console.log('x ',x )
      if (x == '1') {
        res.send({orders:delayedOrders});
      }
  }

//  console.log(delayedOrders);
  // let products = [];
  // for await (var variant of variants) {
  //   let product = await Variant.findOne({
  //     where : {
  //       id : variant
  //     },
  //     attributes : ['id','price','title','product_id'],
  //     include : [
  //       {
  //         model: Product,
  //         as: 'product',
  //         attributes : ['id','title','vendor','status']
  //       }
  //     ]
  //   })
  //   products.push(product);
  // }
  // res.send({products:products});


 

} catch (error) {
  console.error('Error running query:', error);
}
}

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
// Function to insert a cost price monitoring entry
const insertCostPrice = async (c) => {
  try {
    await costPriceMonitoringTable.insert(c);
  } catch (error) {
    console.error('Error inserting cost price monitoring entry:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
// Function to retrieve cost price monitoring entries with a limit
const retrieveCostPrice = async (limit) => {
  try {
    const query = `SELECT * FROM '${productsTable}' WHERE condition LIMIT '${limit}';`;
    // Run the query
    // const [rows] = await bigquery.query(query);
    // // Return the resulting rows
    // return rows;
  } catch (error) {
    console.error('Error executing SQL query:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// NOTE : DO NOT USE THIS FUNCTION (BIGQUERY CODE)
// Function to retrieve unique product webshops
const getProductWebshop = async () => {
  try {
    const [webshops] = await productsTable.query("SELECT DISTINCT webshop FROM products");
    return webshops;
  } catch (error) {
    console.error('Error retrieving product webshops:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// Export functions
export {
  insertProduct,
  insertProductText,
  insertDescription,
  insertVariant,
  insertInventoryitems,
  insertCollection,
  insertManyProducts,
  insertManyVariants,
  insertOrder,
  insertManyOrders,
  insertOrderLineItem,
  insertManyOrderLineItems,
  retrieveOrder,
  retrieveManyOrders,
  retrieveDelayedOrders,
  insertManyInventoryitems,
  insertManyCollections,
  retrieveProduct,
  retrieveProductUpdatedAt,
  retrieveVariant,
  retrieveInventoryItem,
  retrieveCollection,
  retrieveManyProducts,
  retrieveProductsforAI,
  retrieveProductsforAISingle,
  retrieveManyVariants,
  retrieveManyInventoryItems,
  retrieveManyCollections,
  updateProduct,
  updateMetaField,
  updateBulkMetaField,
  updateVariant,
  updateOrCreateVariant,
  updateInventoryItem,
  updateCollection,
  insertCostPrice,
  retrieveCostPrice,
  getProductWebshop,
  createMetaField
};
