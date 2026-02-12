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
  }],
  order_line_items_schema: [
      {
        "name": "id",
        "type": "INT64",
        "required": true
      },
      {
        "name": "orderId",
        "type": "INT64",
        "required": true
      },
      {
        "name": "productId",
        "type": "INT64",
        "required": false
      },
      {
        "name": "productTitle",
        "type": "STRING",
        "required": false
      },
      {
        "name": "productVariantId",
        "type": "INT64",
        "required": false
      },
      {
        "name": "sku",
        "type": "STRING",
        "required": false
      },
      {
        "name": "productVariantTitle",
        "type": "STRING",
        "required": false
      },
      {
        "name": "quantity",
        "type": "INT64",
        "required": true
      },
      {
        "name": "discounts",
        "type": "FLOAT64",
        "required": false
      },
      {
        "name": "duties",
        "type": "FLOAT64",
        "required": false
      },
      {
        "name": "tax",
        "type": "FLOAT64",
        "required": false
      },
      {
        "name": "price",
        "type": "FLOAT64",
        "required": true
      },
      {
        "name": "currency",
        "type": "STRING",
        "required": true
      },
      {
        "name": "discountAllocations",
        "type": 'JSON',
        "required" : false
      },
      {
        "name": "discountApplications",
        "type": "STRING",
        "required": false
      },
      {
        "name": "discountCodes",
        "type": "STRING",
        "required": false
      },
      {
        "name": "fulfillableQuantity",
        "type": "INT64",
        "required": false
      },
      {
        "name": "fulfillmentService",
        "type": "STRING",
        "required": false
      },
      {
        "name": "fulfillmentStatus",
        "type": "STRING",
        "required": false
      },
      {
        "name": "weight",
        "type": "FLOAT64",
        "required": false
      },
      {
        "name": "weightUnit",
        "type": "STRING",
        "required": false
      },
      {
        "name": "status",
        "type": "STRING",
        "required": true,
        "default": "pending purchase"
      },
      {
        "name": "conversionRate",
        "type": "STRING",
        "required": true,
        "default": "1030"
      },
      {
        "name": 'createdAt',
        "type": 'TIMESTAMP',
        "mode": 'REQUIRED',
        "description": 'Timestamp when the line item item was created'
      },
      {
        "name": 'updatedAt',
        "type": 'TIMESTAMP',
        "mode": 'REQUIRED',
        "description": 'Timestamp when the line item item was updated'
      },
      {
        "name": 'shopifyId',
        "type": 'string',
        "mode": 'REQUIRED',
        "description": ''
      },
  ],
  orders_schema:[
      {
        "name": "shopifyId",
        "type": "INT64",
        "required": true
      },
      {
        "name": "addressDistrict",
        "type": "STRING",
        "required": false
      },
      {
        "name": "billingDistrict",
        "type": "STRING",
        "required": false
      },
      {
        "name": "customerEmail",
        "type": "STRING",
        "required": false
      },
      {
        "name": "customerPhone",
        "type": "STRING",
        "required": false
      },
      {
        "name": "customerFirstName",
        "type": "STRING",
        "required": false
      },
      {
        "name": "customerLastName",
        "type": "STRING",
        "required": false
      },
      {
        "name": "note",
        "type": "STRING",
        "required": false
      },
      {
        "name": "noteAttributes",
        "type": "STRING",  // Store JSON as STRING in BigQuery
        "required": false
      },
      {
        "name": "financialStatus",
        "type": "STRING",
        "required": false
      },
      {
        "name": "paymentStatus",
        "type": "STRING",
        "required": false
      },
      {
        "name": "currency",
        "type": "STRING",
        "required": true
      },
      {
        "name": "totalDiscounts",
        "type": "FLOAT64",
        "required": false
      },
      {
        "name": "totalDuties",
        "type": "FLOAT64",
        "required": false
      },
      {
        "name": "totalTax",
        "type": "FLOAT64",
        "required": false
      },
      {
        "name": "subtotalPrice",
        "type": "FLOAT64",
        "required": false
      },
      {
        "name": "totalPrice",
        "type": "FLOAT64",
        "required": true
      },
      {
        "name": "totalOutstanding",
        "type": "FLOAT64",
        "required": true
      },
      {
        "name": 'createdAt',
        "type": 'TIMESTAMP',
        "mode": 'REQUIRED',
        "description": 'Timestamp when the inventory item was created'
      },
      {
        "name": 'updatedAt',
        "type": 'TIMESTAMP',
        "mode": 'REQUIRED',
        "description": 'Timestamp when the inventory item was updated'
      },
      {
        "name": 'deletedAt',
        "type": 'TIMESTAMP',
        "required": false,
        "description": 'Timestamp when the inventory item was updated'
      },
      {
        "name": "closedAt",
        "type": "TIMESTAMP",
        "required": false
      },
      {
        "name": "confirmedAt",
        "type": "TIMESTAMP",
        "required": false
      },
      {
        "name": "cancelledAt",
        "type": "TIMESTAMP",
        "required": false
      },
      {
        "name": "cancelledReason",
        "type": "STRING",
        "required": false
      },
      {
        "name": "addressFirstName",
        "type": "STRING",
        "required": false
      },
      {
        "name": "addressLastName",
        "type": "STRING",
        "required": false
      },
      {
        "name": "addressPhone",
        "type": "STRING",
        "required": false
      },
      {
        "name": "addressLineOne",
        "type": "STRING",
        "required": false
      },
      {
        "name": "addressLineTwo",
        "type": "STRING",
        "required": false
      },
      {
        "name": "addressCity",
        "type": "STRING",
        "required": false
      },
      {
        "name": "addressProvince",
        "type": "STRING",
        "required": false
      },
    {
      "name": 'addressCountry',
      "type": 'STRING',
      "required": false,
    },
    {
      "name": 'addressZip',
      "type": 'STRING',
      "required": false,
    },
    {
      "name": 'billingFirstName',
      "type": 'STRING',
      "required": true,
    },
    {
      "name": 'billingLastName',
      "type": 'STRING',
      "required": true,
    },
    {
      "name": 'billingPhone',
      "type": 'STRING',
      "required": false, // Adjust based on your requirements
    },
    {
      "name": 'billingAddressLineOne',
      "type": 'STRING',
      "required": true,
    },
    {
      "name": 'billingAddressLineTwo',
      "type": 'STRING',
      "required": false,
    },
    {
      "name": 'billingAddressCity',
      "type": 'STRING',
      "required": true,
    },
    {
      "name": 'billingAddressProvince',
      "type": 'STRING',
      "required": false, // Adjust based on your requirements
    },
    {
      "name": 'billingAddressCountry',
      "type": 'STRING',
      "required": true,
    },
    {
      "name": 'billingAddressZip',
      "type": 'STRING',
      "required": true,
    },
    {
      "name": 'billingCompany',
      "type": 'STRING',
      "required": false,
    },
    {
      "name": 'companyName',
      "type": 'STRING',
      "required": false,
    },
    {
      "name": 'discountApplications',
      "type": 'STRING', // Assuming JSON for discount information
      "required": false,
    },
    {
      "name": 'discountCodes',
      "type": 'JSON', // Assuming JSON for discount codes
      "required": false,
    },
    {
      "name": 'fulfillmentStatus',
      "type": 'STRING',
      "required": false,
    },
    {
      "name": 'fulfillmentId',
      "type": 'STRING',
      "required": false,
    },
    {
      "name": 'tags',
      "type": 'STRING', 
      "required": false,
    },
    {
      "name": 'status',
      "type": 'STRING',
      "required": true,
    },
    {
      "name": 'orderNumber',
      "type": 'STRING',
      "required": false,
    },
    {
      "name": 'source',
      "type": 'STRING',
      "required": false,
    },
    {
      "name": 'webshop',
      "type": 'STRING',
      "required": true
    },
    {
      "name": 'priority',
      "type": 'INTEGER',
      "required": false, // Might be required depending on your logic
    },
    {
      "name": 'shopifyShippingLine',
      "type": 'STRING',
      "required": false,
    },
    {
      "name": 'trackingNumber',
      "type": 'STRING',
      "required": false,
    },
    {
      "name": 'sourceURL',
      "type": 'STRING',
      "required": false,
    }
  ],
  productText_schema: [{
    name: 'id',
    type: 'INT64',
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
  {
    name: 'updated_at',
    type: 'TIMESTAMP',
    required: true
  },
  // DateTime becomes TIMESTAMP
  {
    name: 'category',
    type: 'STRING',
    required: true
  }, // Varchar becomes STRING
  {
    name: 'language',
    type: 'STRING',
    required: true
  }, // Varchar becomes STRING
  {
    name: 'new_description',
    type: 'STRING',
    required: true
  }, // Varchar becomes STRING
  {
    name: 'new_title',
    type: 'STRING',
    required: true
  }, // Varchar becomes STRING
  {
    name: 'new_seoDesc',
    type: 'STRING',
    required: true
  },
  ],
};