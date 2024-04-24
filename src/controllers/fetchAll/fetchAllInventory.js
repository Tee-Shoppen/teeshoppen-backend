import {inventoryItems} from './migration.js'

const stores = [
        'teeshoppen-pl',
        'teeshoppen-cz',
        'noodlefirm',
        'teeshoppengermany',
        'teeshoppen-finland',
        'teeshoppen-nl',
        'teeshoppen-norway',
        'teeshoppen-sweden',
        'teeshoppen-uk',
        'teeshoppen-com',
        'test-teeshoppen',
        'femalefashionstore-dk',
      ]
      
const fetchAllProducts = async (res,req,next) => {
    res.sendStatus(200);
    for (const store of stores){
        console.log('fetching for ', store);
        await inventoryItems(store);
    }
}

export default fetchAllProducts;
