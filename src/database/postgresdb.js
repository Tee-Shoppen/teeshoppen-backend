import { Sequelize} from "sequelize";

import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const {DataTypes} = Sequelize;
export const sequelize = new Sequelize(`postgres://${process.env.PSQL_USER}:${process.env.PSQL_PASSWORD}@${process.env.PSQL_HOST}:${process.env.PSQL_PORT}/${process.env.PSQL_DB}`,
{
    dialect: "postgres",
    logging: false,
    pool: {
      max: 3,
    },
    dialectOptions: {
        ssl: {
          require: true, // This will help you. But you will see nwe error
          rejectUnauthorized: false // This line will fix new error
        }
      },
  });

  export const Variant = sequelize.define('variant', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    productId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    inventory_item_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    webshop: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: DataTypes.STRING, // Likely needs adjustment based on actual data format
    sku: DataTypes.STRING,
    position: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    compare_at_price: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: true,
      },
    fulfillment_service: DataTypes.STRING,
    inventory_management: DataTypes.STRING,
    option1: DataTypes.STRING,
    option2: DataTypes.STRING,
    option3: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    lastOrderedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    taxable: DataTypes.BOOLEAN,
    barcode: DataTypes.STRING,
    grams: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    image_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    weight: DataTypes.DOUBLE, // FLOAT64 maps to DOUBLE
    weight_unit: DataTypes.STRING,
    inventory_quantity: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    old_inventory_quantity: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    requires_shipping: DataTypes.BOOLEAN,
    admin_graphql_api_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    schema: "products",
    underscored: true,
    paranoid: true,
  },);

  export const ProductText = sequelize.define('productText', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    product_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    webshop: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    store: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    new_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    new_title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    new_seo_desc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    meta_desc_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    meta_title_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    }
  }, {
    schema: "products",
    underscored: true,
    paranoid: true,
  },);
  
    export const Product = sequelize.define('product', {
        id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        },
        webshop: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        title: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        },
        updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        },
        deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        },
        publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        },
        lastOrderedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        },
        vendor: DataTypes.STRING,
        body_html: DataTypes.STRING,
        product_type: DataTypes.STRING,
        handle: DataTypes.STRING,
        status: DataTypes.STRING,
        template_suffix: DataTypes.STRING,
        published_scope: DataTypes.STRING,
        tags: DataTypes.STRING,
        admin_graphql_api_id: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    },  {
        schema: "products",
        underscored: true,
        paranoid: true,
        hooks: {
          beforeBulkDestroy(options) {
            // eslint-disable-next-line no-param-reassign
            options.individualHooks = true;
            return options;
          },
          afterDestroy: (instance) => {
            ProductVariant.destroy({ where: { productId: instance.id } }).then(
              (count) => {
                console.log(
                  "delete-hook",
                  `Deleted ${count} variants of product ${instance.id}`,
                  3,
                );
              },
            );
          },
        },
      },);

  export const OrderLineItem = sequelize.define('order_line_item', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    product_title: DataTypes.STRING,
    product_variant_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    product_variant_title: DataTypes.STRING,
    quantity: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    discounts: DataTypes.DOUBLE,
    duties: DataTypes.DOUBLE,
    tax: DataTypes.DOUBLE,
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discount_allocations: DataTypes.JSON,
    discount_applications: DataTypes.STRING,
    discount_codes: DataTypes.STRING,
    fulfillable_quantity: DataTypes.BIGINT,
    fulfillment_service: DataTypes.STRING,
    fulfillment_status: DataTypes.STRING,
    weight: DataTypes.DOUBLE,
    weight_unit: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending purchase',
    },
    conversion_rate: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1030',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      }
  }, {
    schema: 'orders',
    underscored: true,
    paranoid: true,
    indexes: [
      {
        name: 'product_id_index',
        using: 'BTREE',
        fields: ['product_id'],
      },
    ],
  });

  export const Order = sequelize.define('order', {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          allowNull: false,
        },
        address_district: DataTypes.STRING,
        billing_district: DataTypes.STRING,
        customer_email: DataTypes.STRING,
        customer_phone: DataTypes.STRING,
        customer_first_name: DataTypes.STRING,
        customer_last_name: DataTypes.STRING,
        note: DataTypes.STRING,
        note_attributes: DataTypes.STRING, // Store JSON data as a string
        financial_status: DataTypes.STRING,
        payment_status: DataTypes.STRING,
        currency: {
          type: DataTypes.STRING,
      
        },
        total_discounts: DataTypes.DOUBLE,
        total_duties: DataTypes.DOUBLE,
        total_tax: DataTypes.DOUBLE,
        subtotal_price: DataTypes.DOUBLE,
        total_price: {
          type: DataTypes.DOUBLE,
    
        },
        total_outstanding: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          },
          updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          },
          deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          },
        closed_at: DataTypes.DATE,
        confirmed_at: DataTypes.DATE,
        cancelled_at: DataTypes.DATE,
        cancelled_reason: DataTypes.STRING,
        address_first_name: DataTypes.STRING,
        address_last_name: DataTypes.STRING,
        address_phone: DataTypes.STRING,
        address_line_one: DataTypes.STRING,
        address_line_two: DataTypes.STRING,
        address_city: DataTypes.STRING,
        address_province: DataTypes.STRING,
        address_country: DataTypes.STRING,
        address_zip: DataTypes.STRING,
        billing_first_name: {
          type: DataTypes.STRING,
      
        },
        billing_last_name: {
          type: DataTypes.STRING,
   
        },
        billing_phone: DataTypes.STRING,
        billing_address_line_one: {
          type: DataTypes.STRING,

        },
        billing_address_line_two: DataTypes.STRING,
        billing_address_city: {
          type: DataTypes.STRING,
      
        },
        billing_address_province: DataTypes.STRING,
        billing_address_country: {
          type: DataTypes.STRING,
      
        },
        billing_address_zip: {
          type: DataTypes.STRING,
        
        },
        billing_company: DataTypes.STRING,
        company_name: DataTypes.STRING,
        discount_applications: DataTypes.STRING, // JSON data stored as string
        discount_codes: {
          type: DataTypes.JSON, // Assuming discount codes are stored as JSON
        },
        fulfillment_status: DataTypes.STRING,
        fulfillment_id: DataTypes.STRING,
        tags: DataTypes.STRING,
        status: {
          type: DataTypes.STRING,
      
        },
        order_number: DataTypes.STRING,
        source: DataTypes.STRING,
        webshop: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        priority: DataTypes.INTEGER, // Adjust if required based on your logic
        shopify_shipping_line: DataTypes.STRING,
        tracking_number: DataTypes.STRING,
        source_url: DataTypes.STRING, 
  }, {
    schema: 'orders',
    underscored: true,
    paranoid: true,
    hooks: {
      beforeBulkDestroy(options) {
        // eslint-disable-next-line no-param-reassign
        options.individualHooks = true;
        return options;
      },
      afterDestroy: (instance) => {
        OrderLineItem.destroy({ where: { order_id: instance.id } })
          .then((count) => {
            console.log('delete-hook', `Deleted ${count} line items of order ${instance.id}`);
          });
      },
    },
    indexes: [
      {
        name: 'updated_at_index',
        using: 'BTREE',
        fields: ['updated_at'],
      },
    ],
  });
  
    // Define foreign key relationship
    Order.hasMany(OrderLineItem, { as: 'lineItems', foreignKey: { name: 'order_id', allowNull: false } });
    OrderLineItem.belongsTo(Order, { as: 'order', foreignKey: { name: 'order_id', allowNull: false } });
    
    //OrderLineItem.hasMany(Variant, { as: 'variants', foreignKey: { name: 'variant_id', allowNull: false } });

    ProductText.belongsTo(Product, {as: "product", foreignKey: 'productId', allowNull: false });
    Variant.belongsTo(Product, {as: "product", foreignKey: { name: "productId", allowNull: false },});
    Product.hasMany(Variant, {as: "variants",foreignKey: { name: "productId", allowNull: false },});

  export const InventoryItem = sequelize.define('inventory_item', {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          allowNull: false,
        },
        variant_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        webshop: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        cost: {
          type: DataTypes.STRING, // Needs adjustment based on data format (number?)
          allowNull: false,
        },
        countryCodeOfOrigin: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        countryHarmonizedSystemCodes: {
          type: DataTypes.JSON, // Assuming data can be stored as JSON
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        harmonizedSystemCode: {
          type: DataTypes.BIGINT, // Needs adjustment if HS code is a string
          allowNull: true,
        },
        provinceCodeOfOrigin: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        sku: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        tracked: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        requiresShipping: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
      }, {
        schema: "inventory_items",
        underscored: true,
        paranoid: true,
      });
      
      

  export const Collection = sequelize.define('collection', {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          allowNull: false,
        },
        webshop: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        handle: DataTypes.STRING,
        title: {
          type: DataTypes.STRING,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        deletedAt: {
            type: DataTypes.DATE,
          },
        body_html: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        publishedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        sort_order: DataTypes.STRING,
        template_suffix: DataTypes.STRING,
        published_scope: DataTypes.STRING,
        admin_graphql_api_id: {
          type: DataTypes.STRING,
        },
      }, {
            schema: "collections",
            underscored: true,
            paranoid: true,
      });

  export const Printing = sequelize.define('printing', {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
        },
        link: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      }, {
        // Additional options like schema name, timestamps, etc. can be added here
      });

  export const RefundFraudMonitoring = sequelize.define('refund_fraud_monitoring', {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        link: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        store: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        refundOf: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        amountRefunded: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      }, {
        // Additional options like schema name, timestamps, etc. can be added here
      });
      
  export const CostPriceMonitoring = sequelize.define('cost_price_monitoring', {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        link: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        store: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        variants: {
          type: DataTypes.JSON, // Needs adjustment to store variant data
          allowNull: true,
        },
        orderCost: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        orderPrice: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      }, {
        // Additional options like schema name, timestamps, etc. can be added here
      });
      
  export const Status = sequelize.define('status', {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      }, {
        // Additional options like schema name, timestamps, etc. can be added here
      });
  
  export const User = sequelize.define('user', {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        position: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      }, {
        // Additional options like schema name, timestamps, etc. can be added here
      });

  export const Role = sequelize.define('role', {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        }
      }, {
        // Additional options like schema name, timestamps, etc. can be added here
      });