// src/controllers/orders/backfill-orders.js
/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { Order } from '../../database/postgresdb.js';
import createOrderModel from './create-order.js';
import { insertOrder } from '../../database/queries.js';
import { subDomainMap } from '../utilities/shop-mapper.js';
import { triggerMake } from './trigger-make.js';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * GET /api/orders/backfill-orders?store=noodlefirm&date=2026-01-16T00:00:00Z
 * - store is REQUIRED
 * - date is OPTIONAL (created_at_min)
 */
const backfillOrders = async (req, res) => {
  const { store, date } = req.query;

  if (!store) return res.status(400).json({ error: 'store is required' });

  // respond immediately (avoid heroku timeout)
  res.status(202).json({
    message: 'Backfill started',
    store,
    created_at_min: date || 'ALL',
  });

  try {
    const domainInfo = subDomainMap(store);
    const webshop = domainInfo.name;
    const apiKey = process.env[domainInfo.apiKey];
    if (!apiKey) throw new Error(`Missing API key env var for ${store}`);

    let url = `https://${webshop}.myshopify.com/admin/api/2024-04/orders.json?status=any`;
    if (date) url += `&created_at_min=${encodeURIComponent(date)}`;

    let nextLinkExist = false;

    for (let page = 0; page < 100000; page += 1) {
      nextLinkExist = false;

      const resp = await axios.get(url, {
        headers: { 'X-Shopify-Access-Token': apiKey },
        params: {
          limit: 250,
          fields:
            'id,created_at,updated_at,closed_at,email,phone,customer,note,'
            + 'financial_status,currency,total_discounts,total_tax,tags,'
            + 'subtotal_price,total_price,total_outstanding,'
            + 'cancelled_at,cancel_reason,fulfillment_status,source_name,billing_address,'
            + 'shipping_address,shipping_lines,original_total_duties_set,'
            + 'line_items,fulfillments,refunds,name,discount_applications,note_attributes,discount_codes',
        },
      });

      const shopifyOrders = resp.data.orders || [];
      console.log(`[order_backfill] ${webshop}: fetched ${shopifyOrders.length} orders`);

      let inserted = 0;
      let skipped = 0;

      for (const order of shopifyOrders) {
        const orderId = order.id;

        // ✅ idempotency (same as your webhook)
        const existing = await Order.findOne({ where: { id: orderId } });
        if (existing) {
          skipped += 1;
          continue;
        }

        const mapped = await createOrderModel(order, webshop);

        // ✅ save first
        await insertOrder(mapped);
        inserted += 1;

        // ✅ then Make (fire-and-forget)
        triggerMake(orderId);

        // keep it gentle
        await sleep(50);
      }

      console.log(`[order_backfill] ${webshop}: inserted=${inserted}, skipped=${skipped}`);

      // pagination
      const headerLink = resp.headers.link;
      if (headerLink && headerLink.includes('rel="next"')) {
        const linkArray = headerLink.split(', ');
        const nextLink = linkArray.find((l) => l.includes('rel="next"'));
        if (nextLink) {
          url = nextLink.split(';')[0].replace('<', '').replace('>', '').trim();
          nextLinkExist = true;
        }
      }

      if (!nextLinkExist) break;

      await sleep(400);
    }

    console.log(`[order_backfill] ${webshop}: backfill completed`);
  } catch (err) {
    console.error('[order_backfill] failed', err.response?.data || err.message || err);
  }
};

export default backfillOrders;
