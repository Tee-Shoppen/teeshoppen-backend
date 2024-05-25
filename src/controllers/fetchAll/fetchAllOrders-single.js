import initializeOrders from '../orders/initialize-orders.js';
      
const fetchAllOrdersSingleStore = async (req,res,next) => {
    if(!req.query.name) return;
    res.sendStatus(200);
    console.log('fetching for ', store);
    let {name : store} = req.query
    await initializeOrders(store);
}

export default fetchAllOrdersSingleStore;
