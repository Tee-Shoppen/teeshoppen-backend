import {all, inventoryItems} from './migration.js'
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const stores = [
        // 'teeshoppen-pl',
        // 'teeshoppen-cz',
        // 'noodlefirm',
        // 'teeshoppengermany',
        // 'teeshoppen-finland',
        // 'teeshoppen-nl',
        // 'teeshoppen-norway',
        // 'teeshoppen-sweden',
        'teeshoppen-uk',
        // 'teeshoppen-com',
        // 'test-teeshoppen',
        // 'femalefashionstore-dk',
      ]
      
const fetchAllProducts = async (req,res,next) => {
    res.sendStatus(200);
    for (const store of stores){
        console.log('fetching for ', store);
        if(process.env.INIT_SHOPIFY_PRODUCTS){
            await all(store);
        }
        if(process.env.INIT_SHOPIFY_INVENTORY){
            await inventoryItems(store);
        }
           
        //await variants(store);
    }
}

export default fetchAllProducts;
