import Apis from "./index.js";

export default class Shopify extends Apis {
  subdomain
  constructor(subDomain, apiKey) {
    super({
      baseURL: `https://${subDomain}.myshopify.com/admin/api/2023-10`,
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
}

