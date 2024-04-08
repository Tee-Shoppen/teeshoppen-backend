import {all} from './migration.js'

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
      
const fetchAllProducts = async () => {
    for (const store of stores){
        console.log('fetching for ', store);
        await all(store);
    }
}

export default fetchAllProducts;
