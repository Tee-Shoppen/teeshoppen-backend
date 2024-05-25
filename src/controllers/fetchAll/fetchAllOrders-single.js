import initializeOrders from '../orders/initialize-orders.js';
      
const fetchAllOrdersSingleStore = async (req,res,next) => {
    if(!req.query) return;
    res.sendStatus(200);
    let {name : store} = req.query
    let date = req.query.created_at_min;
    console.log('fetching for ', store);
    await initializeOrders(store,date);
}

export default fetchAllOrdersSingleStore;
