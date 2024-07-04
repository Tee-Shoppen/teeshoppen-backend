import axios from 'axios';
import { Product, Variant, sequelize } from '../../database/postgresdb.js';
import createProductModel from './create-from-shopify.js';
import { domainToSubDomain, subDomainMap } from '../utilities/shop-mapper.js';

async function getCostPrice(details,inventoryId) {
    let store = details.webshop;
    let key = details.api;
    const url = `https://${store}.myshopify.com/admin/api/2024-04/inventory_items.json?ids=${inventoryId}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'X-Shopify-Access-Token': key,
            },
        });

        const costprice = response.data.inventory_items[0].cost;
        return costprice;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function bulkRefetch(req, res, next) {
    console.log('PRODUCT REFETCH STARTING');
    const returnMessage = {};
    let nextPageUrl = null;
    let hasNextPage = false;
    let domain = req.query.domain
    const domainInformation = subDomainMap(domainToSubDomain(domain))
    const webshop = domainInformation.name
    const { [domainInformation.apiKey] : apiKey } = process.env
    let details = {
        webshop : webshop,
        api : apiKey
      }

    do {
        const url = nextPageUrl || `https://${webshop}.myshopify.com/admin/api/2024-04/products.json`;
        try {
            const response = await axios.get(url, {
                headers: {
                    'X-Shopify-Access-Token': apiKey,
                }
            });

            const header = { 'x-shopify-shop-domain': 'teeshoppen-uk' };
            response.headers = { ...response.headers, ...header };
            const products = response.data.products;
            console.log(`BULK FETCH, Processing ${products.length} products...`);

            for (const product of products) {
                const a = {
                    headers: header,
                    body: product
                };
                const productModel = await createProductModel(a);

                const p = await Product.findOne({
                    where: { id: product.id },
                });

                if (!p) {
                    console.log('Product not found in db. Fetching product ' + product.id);
                    await sequelize.transaction(async (t) => {
                        await Product.create(productModel, {
                            include: [{
                                model: Variant,
                                as: 'variants',
                            }],
                            returning: true,
                        }, { transaction: t });
                    });
                } else {
                    console.log('Product found. Updating product ' + product.id);
                    p.created_at = productModel.created_at;
                    p.save();
                    const variants = await Variant.findAll({
                        where: { productId: p.id },
                    });

                    if (variants) {
                        for (const variant of variants) {
                            const updatedVariant = await productModel.variants.find((updatedVar) => updatedVar.id == variant.id);
                            if (updatedVariant) {
                                const cost_price = await getCostPrice(details,variant.inventory_item_id);
                                variant.setDataValue('createdAt', updatedVariant.created_at);
                                variant.cost_price = cost_price;
                                await variant.save();
                                await sleep(100); // Introduce a delay between API requests
                            }
                        }
                    }
                }
            }

            const headerLink = response.headers.link || null;
            if (headerLink) {
                //console.log('Parsing header link for next page');
                if (headerLink.includes('rel="next"')) {
                    hasNextPage = true;
                    const linkArray = headerLink.split(',');
                    const nextLink = linkArray.find(link => link.includes('rel="next"'));
                    if (nextLink) {
                        nextPageUrl = nextLink.split(';')[0].replace('<', '').replace('>', '').trim();
                       // console.log('Next Page URL:', nextPageUrl);
                    }
                } else {
                    //console.log('No next page found in header link');
                    hasNextPage = false;
                }
            } else {
               // console.log('headerlink false'); // This should print if headerLink is null
                hasNextPage = false;
            }
        } catch (err) {
            console.log('ERROR SHOPIFY ' + err);
            //systemLog('bulk-fetch', err.response?.data || err.stack || err.message || err.toString(), 1);
            returnMessage['errors'] = err;
            hasNextPage = false; // Stop the loop if there's an error
        }

      //  console.log('hasNextPage:', hasNextPage); // Log the hasNextPage value
        await sleep(1000); // wait for a second to avoid CONN REFUSED
    } while (hasNextPage);

    //console.log('Loop has finished'); // Log when the loop is finished
    returnMessage['message'] = 'Products bulk fetch done';
    console.log('returnMessage:', returnMessage); // Log the return message
    res.status(200).json({ returnMessage });
    next();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default bulkRefetch;
