// src/controllers/orders/trigger-make.js
import axios from 'axios';

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/jcc3nyoa2jmm7wyep9lkj1nz3cqdi79m';

export function triggerMake(orderId) {
  // fire-and-forget, same as your orders/create webhook
  axios
    .post(
      MAKE_WEBHOOK_URL,
      { orderId },
      { headers: { 'Content-Type': 'application/json' } }
    )
    .catch((err) => console.error('Make.com webhook failed:', err.message));
}
