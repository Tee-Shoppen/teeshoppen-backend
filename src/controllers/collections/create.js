import { insertCollection } from '../../database/queries.js'
import { subDomainMap, domainToSubDomain } from '../utilities/shop-mapper.js'


const collectionCreation = async (req) => {
  const { body: collection } = req
  const { 'x-shopify-shop-domain': domain } = req.headers
  const domainInformation = subDomainMap(domainToSubDomain(domain))
  const webshop = domainInformation.name

  const collectionMapped = {
    webshop,
    id: collection.id,
    title: collection.title,
    updated_at: new Date(collection.updated_at),
    published_at: new Date(collection.published_at),
    admin_graphql_api_id: collection.admin_graphql_api_id,
    body_html: collection.body_html,
    handle: collection.handle,
    template_suffix: collection.template_suffix,
    published_scope: collection.published_scope,
    sort_order: collection.sort_order,
  }

    return collectionMapped;
 }

export default collectionCreation
