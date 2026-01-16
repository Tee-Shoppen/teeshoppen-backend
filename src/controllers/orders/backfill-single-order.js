// src/controllers/orders/backfill-single-order.js
import axios from 'axios';
import { Order } from '../../database/postgresdb.js';
import createOrderModel from './create-order.js';
import { insertOrder } from '../../database/queries.js';
import { subDomainMap } from '../utilities/shop-mapper.js';
import { triggerMake } from './trigger-make.js';

const backfillSingleOrder = async (req, res) => {
  const { store, orderId } = req.query;

  if (!store || !orderId) {
    return res.status(400).json({ error: 'store and orderId are required' });
  }

  res.status(202).json({ message: 'Single order backfill started', store, orderId });

  try {
    const domainInfo = subDomainMap(store);
    const webshop = domainInfo.name;
    const apiKey = process.env[domainInfo.apiKey];
    if (!apiKey) throw new Error(`Missing API key env var for ${store}`);

    // ✅ fetch from Shopify
    const url = `https://${webshop}.myshopify.com/admin/api/2024-04/orders/${orderId}.json`;
    const { data } = await axios.get(url, {
      headers: { 'X-Shopify-Access-Token': apiKey },
    });

    const order = data.order;
    if (!order) {
      console.log('[single_order_backfill] no order returned', { store, orderId });
      return;
    }

    // ✅ idempotency check
    const existing = await Order.findOne({ where: { id: order.id } });
    if (existing) {
      console.log('[single_order_backfill] already exists, triggering Make anyway', order.id);
      triggerMake(order.id);
      return;
    }

    // ✅ insert then Make
    const mapped = await createOrderModel(order, webshop);
    await insertOrder(mapped);
    triggerMake(order.id);

    console.log('[single_order_backfill] inserted + triggered Make', order.id);
  } catch (err) {
    console.error('[single_order_backfill] failed', err.response?.data || err.message || err);
  }
};

export default backfillSingleOrder;
