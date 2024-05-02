import dotenv from "dotenv";
// Import BigQuery module
import { getBigQueryClient } from "./client.js";
dotenv.config({ path: "./.env" });
// Create a BigQuery client instance
const bigquery = getBigQueryClient();
// Define the dataset ID
const datasetId = process.env.BIGQUERY_DATASET_ID;

// Define BigQuery tables
const productsTable = bigquery.dataset(datasetId).table('products');
const variantsTable = bigquery.dataset(datasetId).table('variants');
const inventoryItemsTable = bigquery.dataset(datasetId).table('inventory_items');
const collectionsTable = bigquery.dataset(datasetId).table('collections');
const ordersTable = bigquery.dataset(datasetId).table('orders');
const orderLineItemTable = bigquery.dataset(datasetId).table('order_line_items');
const costPriceMonitoringTable = bigquery.dataset(datasetId).table('cost_price_monitoring');
const productsTextTable = bigquery.dataset(datasetId).table('productText');

// Function to insert a product
const insertProduct = async (p) => {
  try {
    await productsTable.insert(p);
    console.log('Product created.');
  } catch (error) {
    console.error('Error inserting product:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// Function to insert a product
const insertProductText = async (p) => {
  try {
    p.status = 'Need to review';
    await productsTextTable.insert(p);
    console.log('Product has been inserted to productText table.');
  } catch (error) {
    console.error('Error inserting product to productText:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

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
    await inventoryItemsTable.insert(i);
    console.log('inventoryItemsTable creation successful.');
  } catch (error) {
    console.error('Error inserting inventory item:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// Function to insert a collection
const insertCollection = async (c) => {
  try {
    await collectionsTable.insert(c);
    console.log('Collection creation successful.');
  } catch (error) {
    console.error('Error inserting collection:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// Function to insert multiple products
const insertManyProducts = async (p) => {
  try {
    await productsTable.insert(p);
  } catch (error) {
    console.error('Error inserting multiple products:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

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
  try {
    await inventoryItemsTable.insert(i);
  } catch (error) {
    console.error('Error inserting multiple inventory items:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// Function to insert multiple collections
const insertManyCollections = async (c) => {
  try {
    await collectionsTable.insert(c);
  } catch (error) {
    console.error('Error inserting multiple collections:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// Function to retrieve a product by ID
const retrieveProduct = async (req, res, next) => {
    const query = `
    SELECT * FROM ${datasetId}.products where id=${req.params.id}`;

  try {
    // Run the SQL query
    const [rows] = await bigquery.query(query);

  //    return product
      res.send({product:rows});

  } catch (error) {
    console.error('Error running query:', error);
  }
}

// Function to retrieve a product UPATEDAT by ID
const retrieveProductUpdatedAt = async (req, res, next) => {
  const query = `
  SELECT updated_at FROM ${datasetId}.products where id=${req.params.id}`;
try {
  // Run the SQL query
  const [rows] = await bigquery.query(query);
  let updatedAt = rows[0].updated_at? rows[0].updated_at.value : '';

//    return product
    res.send({value:updatedAt});

} catch (error) {
  console.error('Error running query:', error);
}
}


// Function to retrieve a variant by ID
const retrieveVariant = async (req,res,next) => {
  const query = `
  SELECT * FROM ${datasetId}.variants where id=${req.params.id}`;

  try {
    // Run the SQL query
    const [rows] = await bigquery.query(query);

  //    return product
      res.send({variant:rows});

  } catch (error) {
    console.error('Error running query:', error);
  }
};

// Function to retrieve an inventory item by ID
const retrieveInventoryItem = async (i_id) => {
  try {
    const [inventoryItem] = await inventoryItemsTable.get(i_id);
    return inventoryItem;
  } catch (error) {
    console.error('Error retrieving inventory item:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// Function to retrieve a collection by ID
const retrieveCollection = async (req,res,next)=> {
  const query = `
  SELECT * FROM ${datasetId}.collections where id=${req.params.id}`;

try {
  // Run the SQL query
  const [rows] = await bigquery.query(query);

//    return collection
    res.send({collection:rows});

} catch (error) {
  console.error('Error running query:', error);
}
};


// Function to retrieve many products
const retrieveManyProducts = async (req, res, next) => {
    const query = `
    SELECT * FROM ${datasetId}.products limit ${req.query.pageSize} offset ${req.query.page}`;

  try {
    // Run the SQL query
    const [rows] = await bigquery.query(query);

//    return product
      res.send({product:rows});

  } catch (error) {
    console.error('Error running query:', error);
  }
}

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

// Function to retrieve many collections
const retrieveManyCollections = async (req,res,next) => {
  const query = `
  SELECT * FROM ${datasetId}.collections limit ${req.query.pageSize} offset ${req.query.page}`;

  try {
    // Run the SQL query
    const [rows] = await bigquery.query(query);

  //    return collections
      res.send({collections:rows});

  } catch (error) {
    console.error('Error running query:', error);
  }
};

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
        const [queryResults] = await bigquery.query(options);
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
              const [queryResults] = await bigquery.query(options);
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
        const [queryResults] = await bigquery.query(options);
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
      const existingData = await retrieveInventoryItem(i_id);

      if (!existingData) {
        console.error('No existing inventory found.');
      }

      else {
        const rowsToInsert = rowToUpdate;

        // Insert the modified data back into the table
        await inventoryItemsTable.insert(rowsToInsert, { ignoreUnknownValues: true });
        console.log('Inventory row updated successfully.');
      }

      
  } catch (error) {
      console.error('Error updating row:', error);
      throw error;
  }
}

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
  try {
    await ordersTable.insert(o);
    console.log('Order creation successful.');
  } catch (error) {
    console.error('Error inserting order:', JSON.stringify(error));
    throw error; // Re-throw the error for handling by the caller
  }
};

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
  try {
    await ordersTable.insert(p);
  } catch (error) {
    console.error('Error inserting multiple orders:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// Function to insert multiple orderLine ITEMS
const insertManyOrderLineItems = async (p) => {
  try {
    await orderLineItemTable.insert(p);
  } catch (error) {
    console.error('Error inserting multiple order line items:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// Function to retrieve a order by ID
const retrieveOrder = async (req, res, next) => {
  const query = `
  SELECT * FROM ${datasetId}.orders where id=${req.params.id}`;

try {
  // Run the SQL query
  const [rows] = await bigquery.query(query);

//    return order
    res.send({order:rows});

} catch (error) {
  console.error('Error running query:', error);
}
}

// Function to retrieve many orders
const retrieveManyOrders = async (req, res, next) => {
  const query = `
  SELECT * FROM ${datasetId}.products limit ${req.query.pageSize} offset ${req.query.page}`;

try {
  // Run the SQL query
  const [rows] = await bigquery.query(query);

//    return product
    res.send({orders:rows});

} catch (error) {
  console.error('Error running query:', error);
}
}

// Function to insert a cost price monitoring entry
const insertCostPrice = async (c) => {
  try {
    await costPriceMonitoringTable.insert(c);
  } catch (error) {
    console.error('Error inserting cost price monitoring entry:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};


// Function to retrieve cost price monitoring entries with a limit
const retrieveCostPrice = async (limit) => {
  try {
    const query = `SELECT * FROM '${productsTable}' WHERE condition LIMIT '${limit}';`;
    // Run the query
    const [rows] = await bigquery.query(query);
    // Return the resulting rows
    return rows;
  } catch (error) {
    console.error('Error executing SQL query:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

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
  insertManyInventoryitems,
  insertManyCollections,
  retrieveProduct,
  retrieveProductUpdatedAt,
  retrieveVariant,
  retrieveInventoryItem,
  retrieveCollection,
  retrieveManyProducts,
  retrieveManyVariants,
  retrieveManyInventoryItems,
  retrieveManyCollections,
  updateProduct,
  updateVariant,
  updateOrCreateVariant,
  updateInventoryItem,
  updateCollection,
  insertCostPrice,
  retrieveCostPrice,
  getProductWebshop,
};
