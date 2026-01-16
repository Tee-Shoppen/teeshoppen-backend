/* eslint-disable no-await-in-loop */
import axios from 'axios';
import sql from 'sequelize';
import { Variant } from '../../database/postgresdb.js';
import { subDomainMap } from '../utilities/shop-mapper.js';

const { Op } = sql;

async function fetchCostsForInventoryIds({ webshop, apiKey, inventoryIds }) {
  const url = `https://${webshop}.myshopify.com/admin/api/2024-04/inventory_items.json`;

  const { data } = await axios.get(url, {
    headers: { 'X-Shopify-Access-Token': apiKey },
    params: { ids: inventoryIds.join(',') },
  });

  // Map inventory_item_id -> cost
  const map = new Map();
  for (const item of data.inventory_items || []) {
    map.set(Number(item.id), item.cost ?? null);
  }
  return map;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * GET /api/products/backfill-cost-price?store=noodlefirm
 * Optional: &limit=5000
 */
const backfillCostPrice = async (req, res) => {
  const { store } = req.query;
  const limit = Number(req.query.limit || 5000);

  if (!store) return res.status(400).json({ error: 'store is required' });

  // respond immediately (avoid heroku timeout)
  res.status(202).json({ message: 'Cost price backfill started', store, limit });

  try {
    const domainInfo = subDomainMap(store);
    const webshop = domainInfo.name;
    const apiKey = process.env[domainInfo.apiKey];

    if (!apiKey) throw new Error(`Missing API key env var for ${store}`);

    // Only variants for this webshop with missing cost_price
    const variants = await Variant.findAll({
      where: {
        webshop,
        inventory_item_id: { [Op.ne]: null },
        [Op.or]: [{ cost_price: null }, { cost_price: 0 }],
      },
      attributes: ['id', 'inventory_item_id'],
      limit,
      raw: true,
    });

    console.log(
      `[cost_backfill] ${webshop}: found ${variants.length} variants missing cost_price`
    );

    // De-dupe inventory ids (important)
    const invIdsUnique = [
      ...new Set(
        variants
          .map((v) => Number(v.inventory_item_id))
          .filter((n) => Number.isFinite(n) && n > 0)
      ),
    ];

    console.log(
      `[cost_backfill] ${webshop}: unique inventory_item_ids = ${invIdsUnique.length}`
    );

    const invChunks = chunk(invIdsUnique, 100);

    let updated = 0;
    let shopifyNullCost = 0;
    let notReturnedByShopify = 0;

    for (const idsChunk of invChunks) {
      const costMap = await fetchCostsForInventoryIds({
        webshop,
        apiKey,
        inventoryIds: idsChunk,
      });

      // Only process variants that belong to this chunk
      const variantsInChunk = variants.filter((v) =>
        idsChunk.includes(Number(v.inventory_item_id))
      );

      for (const v of variantsInChunk) {
        const invId = Number(v.inventory_item_id);

        if (!costMap.has(invId)) {
          notReturnedByShopify += 1;
          continue;
        }

        const cost = costMap.get(invId);
        if (cost == null) {
          shopifyNullCost += 1;
          continue;
        }

        const [count] = await Variant.update(
          { cost_price: cost },
          { where: { id: v.id } }
        );

        updated += count;
      }

      // be nice to Shopify rate limits
      await sleep(300);
    }

    console.log(
      `[cost_backfill] ${webshop}: updated=${updated}, shopify_null_cost=${shopifyNullCost}, not_returned=${notReturnedByShopify}`
    );
  } catch (err) {
    console.error('[cost_backfill] failed', err);
  }
};

export default backfillCostPrice;
