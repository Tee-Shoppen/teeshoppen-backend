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
    return this.api.get<{ products}>('/products.json', { params })
  }

  retrieveSingleProduct(product_id, params) {
    return this.api.get<{ product }>(`/products/${product_id}.json`, { params })
  }

  retrieveProductsCount(ParamsRetrieveCollections) {
    return this.api.get<{ count }>('/products/count.json', { params })
  }

  updateProduct(product_id, data) {
    return this.api.put<{ product}>(`/products/${product_id}.json`, { product: { id: product_id, ...data } })
  }

  // variants
  retrieveVariantsOfProduct(product_id, params) {
    return this.api.get<{ variants }>(`/products/${product_id}/variants.json`, { params })
  }

  retrieveSingleVariant(variant_id, params) {
    return this.api.get<{ variant}>(`/variants/${variant_id}.json`, { params })
  }

  retrieveVariantsCount(product_id) {
    return this.api.get<{ count }>(`/products/${product_id}/variants/count.json`)
  }

  // inventory items
  retrieveInventoryItems(params) {
    return this.api.get<{ inventory_items }>('/inventory_items.json', { params })
  }

  // collects
  retrieveCollects(params) {
    return this.api.get<{ collects}>('/collects.json', { params })
  }

  retrieveSingleCollect(collect_id, params) {
    return this.api.get<{ collect}>(`/collects/${collect_id}.json`, { params })
  }

  retrieveCollectsCount(params) {
    return this.api.get<{ count }>('/collects/count.json', { params })
  }

  // collection
  retrieveCollectionsOfProducts(collection_id, params) {
    return this.api.get<{ products}>(`/collections/${collection_id}/products.json`, { params })
  }

  retrieveSingleCollection(collection_id, params) {
    return this.api.get<{ collection }>(`/collections/${collection_id}.json`, { params })
  }
}

