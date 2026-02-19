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

  const map = new Map();
  for (const item of data.inventory_items || []) {
    map.set(Number(item.id), item.cost ?? null);
  }
  return map;
}

// NEW: Helper to get the absolute latest inventory_item_id from Shopify
async function getLatestInventoryId(webshop, apiKey, variantId) {
  const url = `https://${webshop}.myshopify.com/admin/api/2024-04/variants/${variantId}.json`;
  try {
    const { data } = await axios.get(url, {
      headers: { 'X-Shopify-Access-Token': apiKey },
    });
    return data.variant.inventory_item_id;
  } catch (err) {
    return null;
  }
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const backfillCostPrice = async (req, res) => {
  const { store } = req.query;
  const limit = Number(req.query.limit || 5000);

  if (!store) return res.status(400).json({ error: 'store is required' });

  res.status(202).json({ message: 'Cost price backfill started', store, limit });

  try {
    const domainInfo = subDomainMap(store);
    const webshop = domainInfo.name;
    const apiKey = process.env[domainInfo.apiKey];

    if (!apiKey) throw new Error(`Missing API key env var for ${store}`);

    const variants = await Variant.findAll({
      where: {
        webshop,
        [Op.or]: [{ cost_price: null }, { cost_price: 0 }],
        // NEW: Ignore items without SKUs
      sku: { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '' }] }
      },
      attributes: ['id', 'inventory_item_id'],
      limit,
      raw: true,
    });

    console.log(`[cost_backfill] ${webshop}: found ${variants.length} variants to check`);

    let updated = 0;
    let shopifyNullCost = 0;
    let notReturnedByShopify = 0;

    // Process in smaller batches because we are doing individual lookups for stale IDs
    const variantChunks = chunk(variants, 50);

    for (const batch of variantChunks) {
      const invIdsForBatch = [];

      for (const v of batch) {
        // Refresh the ID to solve the "2677 not returned" issue
        const freshInvId = await getLatestInventoryId(webshop, apiKey, v.id);
        
        if (!freshInvId) {
          notReturnedByShopify += 1;
          continue;
        }
        
        // Update local record if the ID was stale
        if (freshInvId !== v.inventory_item_id) {
           await Variant.update({ inventory_item_id: freshInvId }, { where: { id: v.id } });
        }
        
        invIdsForBatch.push(freshInvId);
        v.current_inv_id = freshInvId; // Store temporarily for the cost update
      }

      if (invIdsForBatch.length > 0) {
        const costMap = await fetchCostsForInventoryIds({
          webshop,
          apiKey,
          inventoryIds: invIdsForBatch,
        });

        for (const v of batch) {
          const cost = costMap.get(Number(v.current_inv_id));
          
          if (cost === undefined) continue; // Not in map

          if (cost == null || cost == 0) {
            shopifyNullCost += 1;
            continue;
          }

          const [count] = await Variant.update(
            { cost_price: cost },
            { where: { id: v.id } }
          );
          updated += count;
        }
      }

      await sleep(500); // Respect rate limits
    }

    console.log(`[cost_backfill] ${webshop}: FINISHED. updated=${updated}, shopify_null_cost=${shopifyNullCost}, not_returned=${notReturnedByShopify}`);
  } catch (err) {
    console.error('[cost_backfill] failed', err);
  }
};

export default backfillCostPrice;