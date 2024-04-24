import {all, variants} from './migration.js'

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
        await all(store);
        await variants(store);
    }
}

export default fetchAllProducts;
