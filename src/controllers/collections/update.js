import { updateCollection } from '../../database/queries'

const collectionUpdate = async (req) => {
  const { body: collection } = req

  const collectionMapped = {
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

  const { rowsAffected: collectionsRowsAffected } = await updateCollection(collection.id, collectionMapped)
  console.log(`[Update] Affected rows | Collections: ${collectionsRowsAffected}`)
}

export default collectionUpdate
