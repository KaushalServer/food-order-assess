import { createApp } from './app.js';
import { scheduleOrderProgress } from './simulator.js';
import { repository } from './store.js';

const app = createApp();
// Schedule the demo progression for orders created through the running server.
const originalCreate = repository.createOrder.bind(repository);
repository.createOrder = (data) => {
  const order = originalCreate(data);
  scheduleOrderProgress(order.id);
  return order;
};

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`Order API listening on http://localhost:${port}`));
