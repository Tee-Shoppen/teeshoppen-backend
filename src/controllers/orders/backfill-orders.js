import initializeOrders from './initialize-orders.js';

const backfillOrders = async (req, res) => {
  const { store, date } = req.query;

  if (!store) {
    return res.status(400).json({ error: 'store is required' });
  }

  // respond immediately
  res.status(202).json({
    message: 'Backfill started',
    store,
    fromDate: date || 'ALL',
  });

  // run async (so request won't timeout)
  initializeOrders(store, date).catch((err) => {
    console.error('Backfill failed', { store, date, err });
  });
};

export default backfillOrders;
