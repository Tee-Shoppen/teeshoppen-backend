"use strict";

export default {
  cost_price_monitoring_schema: [{
    name: 'id',
    type: 'STRING',
    required: true
  },
  // Varchar becomes STRING
  {
    name: 'status',
    type: 'STRING',
    required: true
  },
  // Enum becomes STRING
  {
    name: 'link',
    type: 'STRING',
    required: true
  },
  // Varchar becomes STRING
  {
    name: 'store',
    type: 'STRING',
    required: true
  },
  // Varchar becomes STRING
  {
    name: 'variants',
    type: 'STRING'
  },
  // JSON becomes STRING (adjustment needed)
  {
    name: 'order_cost',
    type: 'FLOAT64',
    required: true
  },
  // Double becomes FLOAT64
  {
    name: 'order_price',
    type: 'FLOAT64',
    required: true
  },
  // Double becomes FLOAT64
  {
    name: 'created_at',
    type: 'TIMESTAMP',
    required: true
  } // DateTime becomes TIMESTAMP
  ],
  refund_fraud_monitoring_schema: [{
    name: 'id',
    type: 'STRING',
    required: true
  },
  // Varchar becomes STRING
  {
    name: 'status',
    type: 'STRING',
    required: true
  },
  // Enum becomes STRING
  {
    name: 'link',
    type: 'STRING',
    required: true
  },
  // Varchar becomes STRING
  {
    name: 'store',
    type: 'STRING',
    required: true
  },
  // Varchar becomes STRING
  {
    name: 'refund_of',
    type: 'STRING',
    required: true
  },
  // Varchar becomes STRING
  {
    name: 'amount_refunded',
    type: 'FLOAT64',
    required: true
  },
  // Double becomes FLOAT64
  {
    name: 'created_at',
    type: 'TIMESTAMP',
    required: true
  } // DateTime becomes TIMESTAMP
  ],
  shopify_users_schema: [{
    name: 'id',
    type: 'INT64',
    required: true
  },
  // BigInt becomes INT64
  {
    name: 'name',
    type: 'STRING',
    required: true
  },
  // Varchar becomes STRING
  {
    name: 'email',
    type: 'STRING',
    required: true
  } // Varchar becomes STRING
  ],
  printing_schema: [{
    name: 'id',
    type: 'STRING',
    required: true
  },
  // Varchar becomes STRING
  {
    name: 'link',
    type: 'STRING',
    required: true
  } // Varchar becomes STRING
  ],
  description_ai_schema: [{
    name: 'id',
    type: 'STRING',
    required: true
  },
  // Varchar becomes STRING
  {
    name: 'status',
    type: 'STRING',
    required: true
  },
  // Enum becomes STRING
  {
    name: 'title',
    type: 'STRING',
    required: true
  },
  // Varchar becomes STRING
  {
    name: 'link',
    type: 'STRING',
    required: true
  },
  // Varchar becomes STRING
  {
    name: 'store',
    type: 'STRING',
    required: true
  },
  // Varchar becomes STRING
  {
    name: 'created_at',
    type: 'TIMESTAMP',
    required: true
  },
  // DateTime becomes TIMESTAMP
  {
    name: 'category',
    type: 'STRING',
    required: true
  } // Varchar becomes STRING
  ],
  products_schema: [{
    name: 'id',
    type: 'INT64',
    required: true
  },
  // BigInt becomes INT64
  {
    name: 'webshop',
    type: 'STRING',
    required: true
  },
  // Varchar becomes STRING
  {
    name: 'title',
    type: 'STRING',
    required: true
  },
  // Varchar becomes STRING
  {
    name: 'created_at',
    type: 'TIMESTAMP',
    required: true
  },
  // DateTime becomes TIMESTAMP
  {
    name: 'updated_at',
    type: 'TIMESTAMP',
    required: true
  },
  // DateTime becomes TIMESTAMP
  {
    name: 'published_at',
    type: 'TIMESTAMP',
    required: true
  },
  // DateTime becomes TIMESTAMP
  {
    name: 'last_ordered_at',
    type: 'TIMESTAMP',
    required: true
  },
  // DateTime becomes TIMESTAMP
  {
    name: 'vendor',
    type: 'STRING',
    required: false
  },
  // Varchar becomes STRING (nullable)
  {
    name: 'body_html',
    type: 'STRING',
    required: false
  },
  // Text becomes STRING (nullable)
  {
    name: 'product_type',
    type: 'STRING',
    required: false
  },
  // Varchar becomes STRING (nullable)
  {
    name: 'handle',
    type: 'STRING',
    required: false
  },
  // Varchar becomes STRING (nullable)
  {
    name: 'status',
    type: 'STRING',
    required: false
  },
  // Varchar becomes STRING (nullable)
  {
    name: 'template_suffix',
    type: 'STRING',
    required: false
  },
  // Varchar becomes STRING (nullable)
  {
    name: 'published_scope',
    type: 'STRING',
    required: false
  },
  // Varchar becomes STRING (nullable)
  {
    name: 'tags',
    type: 'STRING',
    required: false
  },
  // Text becomes STRING (nullable)
  {
    name: 'admin_graphql_api_id',
    type: 'STRING',
    required: true
  } // Varchar becomes STRING
  ],
  variants_schema: [{
    name: 'id',
    type: 'INT64',
    required: true
  },
  // BigInt53 becomes INT64
  {
    name: 'product_id',
    type: 'INT64',
    required: true
  },
  // BigInt53 becomes INT64
  {
    name: 'inventory_item_id',
    type: 'INT64',
    required: true
  },
  // BigInt53 becomes INT64
  {
    name: 'webshop',
    type: 'STRING',
    required: true
  },
  // Varchar becomes STRING
  {
    name: 'title',
    type: 'STRING',
    required: true
  },
  // Varchar becomes STRING
  {
    name: 'price',
    type: 'STRING',
    required: true
  },
  // Varchar becomes STRING (price is likely a string representation of a number)
  {
    name: 'sku',
    type: 'STRING',
    required: false
  },
  // Varchar becomes STRING (nullable)
  {
    name: 'position',
    type: 'INT64',
    required: false
  },
  // MySqlInt becomes INT64 (nullable)
  {
    name: 'compare_at_price',
    type: 'STRING',
    required: false
  },
  // Varchar becomes STRING (nullable)
  {
    name: 'fulfillment_service',
    type: 'STRING',
    required: false
  },
  // Varchar becomes STRING (nullable)
  {
    name: 'inventory_management',
    type: 'STRING',
    required: false
  },
  // Varchar becomes STRING (nullable)
  {
    name: 'option1',
    type: 'STRING',
    required: false
  },
  // Varchar becomes STRING (nullable)
  {
    name: 'option2',
    type: 'STRING',
    required: false
  },
  // Varchar becomes STRING (nullable)
  {
    name: 'option3',
    type: 'STRING',
    required: false
  },
  // Varchar becomes STRING (nullable)
  {
    name: 'created_at',
    type: 'TIMESTAMP',
    required: true
  },
  // DateTime becomes TIMESTAMP
  {
    name: 'updated_at',
    type: 'TIMESTAMP',
    required: true
  },
  // DateTime becomes TIMESTAMP
  {
    name: 'last_ordered_at',
    type: 'TIMESTAMP',
    required: true
  },
  // DateTime becomes TIMESTAMP
  {
    name: 'taxable',
    type: 'BOOL',
    required: false
  },
  // MySqlBoolean becomes BOOL (nullable)
  {
    name: 'barcode',
    type: 'STRING',
    required: false
  },
  // Varchar becomes STRING (nullable)
  {
    name: 'grams',
    type: 'INT64',
    required: false
  },
  // MySqlInt becomes INT64 (nullable)
  {
    name: 'image_id',
    type: 'INT64',
    required: false
  },
  // BigInt53 becomes INT64 (nullable)
  {
    name: 'weight',
    type: 'FLOAT64',
    required: false
  },
  // MySqlInt becomes FLOAT64 (better for decimal values, nullable)
  {
    name: 'weight_unit',
    type: 'STRING',
    required: false
  },
  // Varchar becomes STRING (nullable)
  {
    name: 'inventory_quantity',
    type: 'INT64',
    required: false
  },
  // MySqlInt becomes INT64 (nullable)
  {
    name: 'old_inventory_quantity',
    type: 'INT64',
    required: false
  },
  // MySqlInt becomes INT64 (nullable)
  {
    name: 'requires_shipping',
    type: 'BOOL',
    required: false
  },
  // MySqlBoolean becomes BOOL (nullable)
  {
    name: 'admin_graphql_api_id',
    type: 'STRING',
    required: true
  } // Varchar becomes STRING
  ],
  inventory_items_schema: [{
    name: 'id',
    type: 'INT64',
    mode: 'REQUIRED',
    description: 'Unique identifier for the inventory item'
  }, {
    name: 'variant_id',
    type: 'INT64',
    mode: 'REQUIRED',
    description: 'Unique identifier for the variant'
  }, {
    name: 'webshop',
    type: 'STRING',
    mode: 'REQUIRED',
    description: 'Webshop associated with the inventory item'
  }, {
    name: 'cost',
    type: 'STRING',
    mode: 'REQUIRED',
    description: 'Cost of the inventory item'
  }, {
    name: 'country_code_of_origin',
    type: 'STRING',
    mode: 'NULLABLE',
    description: 'Country code of origin for the inventory item'
  }, {
    name: 'country_harmonized_system_codes',
    type: 'RECORD',
    mode: 'REPEATED',
    fields: [{
      name: 'harmonized_system_code',
      type: 'STRING'
    }, {
      name: 'country_code',
      type: 'STRING'
    }],
    description: 'Harmonized system codes for different countries'
  }, {
    name: 'created_at',
    type: 'TIMESTAMP',
    mode: 'REQUIRED',
    description: 'Timestamp when the inventory item was created'
  }, {
    name: 'harmonized_system_code',
    type: 'INT64',
    mode: 'NULLABLE',
    description: 'Harmonized system code for the inventory item'
  }, {
    name: 'province_code_of_origin',
    type: 'STRING',
    mode: 'NULLABLE',
    description: 'Province code of origin for the inventory item'
  }, {
    name: 'sku',
    type: 'STRING',
    mode: 'REQUIRED',
    description: 'Stock keeping unit (SKU) for the inventory item'
  }, {
    name: 'tracked',
    type: 'BOOL',
    mode: 'NULLABLE',
    description: 'Boolean indicating if the inventory item is tracked'
  }, {
    name: 'updated_at',
    type: 'TIMESTAMP',
    mode: 'REQUIRED',
    description: 'Timestamp when the inventory item was last updated'
  }, {
    name: 'requires_shipping',
    type: 'BOOL',
    mode: 'NULLABLE',
    description: 'Boolean indicating if the inventory item requires shipping'
  }],
  collections_schema: [{
    name: 'id',
    type: 'INT64',
    required: true
  },
  // Assuming id is an integer
  {
    name: 'webshop',
    type: 'STRING',
    required: true
  }, {
    name: 'handle',
    type: 'STRING',
    required: false
  }, {
    name: 'title',
    type: 'STRING',
    required: true
  }, {
    name: 'updated_at',
    type: 'TIMESTAMP',
    required: true
  }, {
    name: 'body_html',
    type: 'STRING',
    required: false
  }, {
    name: 'published_at',
    type: 'TIMESTAMP',
    required: true
  }, {
    name: 'sort_order',
    type: 'STRING',
    required: false
  }, {
    name: 'template_suffix',
    type: 'STRING',
    required: false
  }, {
    name: 'published_scope',
    type: 'STRING',
    required: false
  }, {
    name: 'admin_graphql_api_id',
    type: 'STRING',
    required: true
  }]
};