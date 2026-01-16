/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { Op } from 'sequelize';
import { Order, OrderLineItem, sequelize } from '../../database/postgresdb.js';
import createOrderModel from './create-order.js';
import { subDomainMap } from '../utilities/shop-mapper.js';

/**
 * GET /api/orders/backfill-single-order?store=noodlefirm&orderId=7279605154120
 * Headers: x-server=true
 */
const backfillSingleOrder = async (req, res) => {
  const { store, orderId } = req.query;

  if (!store) return res.status(400).json({ error: 'store is required' });
  if (!orderId) return res.status(400).json({ error: 'orderId is required' });

  // respond immediately (avoid heroku timeout)
  res.status(202).json({ message: 'Single order backfill started', store, orderId });

  try {
    const domainInfo = subDomainMap(store);
    const webshop = domainInfo.name;
    const apiKey = process.env[domainInfo.apiKey];
    if (!apiKey) throw new Error(`Missing API key env var for ${store}`);

    // 1) Fetch order from Shopify
    const url = `https://${webshop}.myshopify.com/admin/api/2024-04/orders/${orderId}.json`;
    const { data } = await axios.get(url, {
      headers: { 'X-Shopify-Access-Token': apiKey },
      params: { status: 'any' },
    });

    const shopifyOrder = data?.order;
    if (!shopifyOrder?.id) {
      console.log('[single_order_backfill] Shopify returned no order', { store, orderId });
      return;
    }

    // 2) Map Shopify payload to DB model
    const mapped = await createOrderModel(shopifyOrder, webshop);

    // 3) Upsert inside transaction
    await sequelize.transaction(async (t) => {
      // ✅ lock ONLY the order row (no include => no LEFT JOIN => no postgres error)
      const existing = await Order.findOne({
        where: { id: mapped.id },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!existing) {
        await Order.create(mapped, {
          include: [{ model: OrderLineItem, as: 'lineItems' }],
          transaction: t,
        });

        console.log(`[single_order_backfill] inserted order ${mapped.id} (${webshop})`);
        return;
      }

      // Update order (exclude id + lineItems)
      const { id, lineItems, ...orderWithoutId } = mapped;
      await existing.update(orderWithoutId, { transaction: t });

      // Sync line items
      const incoming = Array.isArray(mapped.lineItems) ? mapped.lineItems : [];
      const keepIds = new Set(incoming.map((li) => li.id));

      for (const li of incoming) {
        const found = await OrderLineItem.findOne({
          where: { id: li.id },
          transaction: t,
          // no lock needed here usually; but safe if you want:
          // lock: t.LOCK.UPDATE,
        });

        const { id: liId, ...liWithoutId } = li;

        if (found) {
          await found.update(
            { ...liWithoutId, order_id: existing.id },
            { transaction: t }
          );
        } else {
          await OrderLineItem.create(
            { id: liId, ...liWithoutId, order_id: existing.id },
            { transaction: t }
          );
        }
      }

      // Delete stale line items
      await OrderLineItem.destroy({
        where: {
          order_id: existing.id,
          id: { [Op.notIn]: Array.from(keepIds) },
        },
        transaction: t,
      });

      console.log(`[single_order_backfill] updated order ${mapped.id} (${webshop})`);
    });
  } catch (err) {
    console.error('[single_order_backfill] failed', err?.response?.data || err);
  }
};

export default backfillSingleOrder;
