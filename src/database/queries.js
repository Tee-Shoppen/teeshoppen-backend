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
const costPriceMonitoringTable = bigquery.dataset(datasetId).table('cost_price_monitoring');


// Export table references
export {
  productsTable as products_tbl,
  variantsTable as variants_tbl,
  inventoryItemsTable as inventoryItems_tbl,
  collectionsTable as collections_tbl,
  costPriceMonitoringTable as costPriceMonitoring_tbl,
};

// Function to insert a product
const insertProduct = async (p) => {
  try {
    await productsTable.insert(p);
    console.log('Product creation successful.');
  } catch (error) {
    console.error('Error inserting product:', error);
    throw error; // Re-throw the error for handling by the caller
  }
};

//const insertProduct = (p: DatabaseProduct) => productsTable.insert(p);

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
// const retrieveProduct = async (p_id: number): Promise<any> => {
//     try {
//       const [product] = await productsTable.get(p_id);
//       console.log(product);
//       return product;
//     } catch (error) {
//       console.error('Error retrieving variant:', error);
//       throw error; // Re-throw the error for handling by the caller
//     }
//   };
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
    updateProduct(rowToUpdate);
    return true; // Indicate successful update
    }

    // Function to construct the update SQL dynamically
    function buildUpdateSql(rowToUpdate) {
      const updateSql = `UPDATE \`${datasetId}.products\` SET `;

      let updateClause = '';
      for (const [key, value] of Object.entries(rowToUpdate)) {
          updateClause += `${key} = @${key}, `;
        
      }

      // Remove the trailing comma from the update clause
      updateClause = updateClause.slice(0, -2);

      return updateSql + updateClause + ` WHERE id = ${p_id} and timestamp < TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 90 MINUTE)`;
    }

    async function updateProduct(rowToUpdate) {
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
  insertVariant,
  insertInventoryitems,
  insertCollection,
  insertManyProducts,
  insertManyVariants,
  insertManyInventoryitems,
  insertManyCollections,
  retrieveProduct,
  retrieveVariant,
  retrieveInventoryItem,
  retrieveCollection,
  retrieveManyProducts,
  retrieveManyVariants,
  retrieveManyInventoryItems,
  retrieveManyCollections,
  updateProduct,
  updateVariant,
  updateInventoryItem,
  updateCollection,
  insertCostPrice,
  retrieveCostPrice,
  getProductWebshop,
};
