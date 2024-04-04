import { insertProduct, insertManyVariants, insertManyInventoryitems } from '../../database/queries.js'
import { domainToSubDomain,subDomainMap } from '../utilities/shop-mapper.js'
import Shopify from '../apis/shopify.js'

