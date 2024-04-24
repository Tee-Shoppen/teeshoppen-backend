function mapShopifyResponseToWareOrderStatuses(fulfillmentStatus, financialStatus) {
  const combined = `${fulfillmentStatus}/${financialStatus}`;
  switch (combined) {
    case "unfulfilled/paid":
      return ["pending purchase", "unfulfilled"];
    case "null/paid":
      return ["pending purchase", "unfulfilled"];
    case "partial/partially_paid":
      return ["payment pending", "fulfilled"];
    case "unfulfilled/partially_paid":
      return ["completed", "fulfilled"];
    case "null/partially_paid":
      return ["completed", "fulfilled"];
    case "unfulfilled/pending":
      return ["cancelled", null];
    case "null/pending":
      return ["payment pending", null];
    case "unfulfilled/unpaid":
      return ["cancelled", null];
    case "null/unpaid":
        return ["cancelled", null];
    case "fulfilled/paid":
      return ["completed", "fulfilled"];
    case "fulfilled/partially_paid":
      return ["payment pending", "fulfilled"];
    case "null/refunded":
      return ["refunded", null];
    case "unfulfilled/refunded":
      return ["cancelled", null];
    case "fulfilled/partially_refunded":
      return ["completed", "partially_fulfilled"];
    case "null/voided":
      return ["cancelled", "unfulfilled"];
    default:
      return ["validate", fulfillmentStatus];
  }
}

function mapShopifyResponseToWareLineItemStatuses(lineFulfillStatus, orderStatus) {
  const combined = `${lineFulfillStatus}/${orderStatus}`;
  switch (combined) {
    case "null/pending purchase":
      return ["pending purchase", "unfulfilled"];
    case "fulfilled/payment pending":
      return ["completed", "fulfilled"];
    case "unfulfilled/completed":
      return ["completed", "fulfilled"];
    case "unfulfilled/cancelled":
      return ["cancelled", null];
    case "null/cancelled":
      return ["cancelled", null];
    case "fulfilled/completed":
      return ["completed", "fulfilled"];
    case "null/refunded":
      return ["refunded", null];
    case "null/completed":
      return ["completed", "fulfilled"];
    default:
      return ["received", null];
  }
}

export { mapShopifyResponseToWareOrderStatuses, mapShopifyResponseToWareLineItemStatuses };

export function validateCombinedOrderCondition(o1, o2) {
  return o1.addressZip === o2.addressZip && true;
}

export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};
