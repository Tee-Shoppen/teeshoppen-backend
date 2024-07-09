import Apis from "./index.js";

export default class Shopify extends Apis {
  subdomain
  constructor(subDomain, apiKey) {
    super({
      baseURL: `https://${subDomain}.myshopify.com/admin/api/2024-04`,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': apiKey,
      },
    })

    this.subdomain = subDomain
  }

  // products
  retrieveProducts(params) {
    return this.api.get('/products.json', { params })
  }

  retrieveSingleProduct(product_id, params) {
    return this.api.get(`/products/${product_id}.json`, { params })
  }

  retrieveProductsCount(params) {
    return this.api.get('/products/count.json', { params })
  }

  retrieveOrdersCount(params) {
    return this.api.get('/orders/count.json', { params })
  }

  retrieveOrders(params) {
    return this.api.get('/orders.json', { params })
  }

  retrieveSingleOrder(order_id, params) {
    return this.api.get(`/orders/${order_id}.json`, { params })
  }

  updateProduct(product_id, data) {
    return this.api.put(`/products/${product_id}.json`, { product: { id: product_id, ...data } })
  }

  // variants
  retrieveVariantsOfProduct(product_id, params) {
    return this.api.get(`/products/${product_id}/variants.json`, { params })
  }

  retrieveSingleVariant(variant_id, params) {
    return this.api.get(`/variants/${variant_id}.json`, { params })
  }

  retrieveVariantsCount(product_id) {
    return this.api.get(`/products/${product_id}/variants/count.json`)
  }

  // inventory items
  retrieveInventoryItems(params) {
    return this.api.get('/inventory_items.json', { params })
  }

  // collects
  retrieveCollects(params) {
    return this.api.get('/collects.json', { params })
  }

  retrieveSingleCollect(collect_id, params) {
    return this.api.get(`/collects/${collect_id}.json`, { params })
  }

  retrieveCollectsCount(params) {
    return this.api.get('/collects/count.json', { params })
  }

  // collection
  retrieveCollectionsOfProducts(collection_id, params) {
    return this.api.get(`/collections/${collection_id}/products.json`, { params })
  }

  retrieveSingleCollection(collection_id, params) {
    return this.api.get(`/collections/${collection_id}.json`, { params })
  }

  //metafields
  retrieveProductMetafield(product_id) {
    return this.api.get(`/products/${product_id}/metafields.json`)
  }

  createProductMetafield(product_id, params) {
    return this.api.post(`/products/${product_id}/metafields.json`, params)
  }

  updateProductMetafield(ids, params) {
    return this.api.put(`/products/${ids.product_id}/metafields/${ids.meta_id}.json`, params)
  }
}

