import { repository, statuses } from './store.js';

// Demo-only progression. Timers are unref'd so they do not keep test/process shutdown alive.
export function scheduleOrderProgress(orderId) {
  [12_000, 28_000, 48_000].forEach((delay) => {
    const timer = setTimeout(() => {
      const order = repository.getOrder(orderId);
      if (!order) return;
      const current = statuses.indexOf(order.status);
      if (current >= 0 && current < statuses.length - 1) repository.updateStatus(orderId, statuses[current + 1]);
    }, delay);
    timer.unref?.();
  });
}
