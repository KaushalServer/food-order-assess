import { randomUUID } from 'node:crypto';
import { menu } from './menu.js';

const orderMap = new Map();
export const statuses = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

export const repository = {
  getMenu() { return menu.map((item) => ({ ...item })); },
  getMenuItem(id) { return menu.find((item) => item.id === id && item.available); },
  createOrder({ customer, address, phone, items }) {
    const lines = items.map(({ menuItem, quantity }) => ({
      itemId: menuItem.id, name: menuItem.name, unitPrice: menuItem.price, quantity,
      lineTotal: menuItem.price * quantity
    }));
    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    const order = {
      id: randomUUID(), customer: { name: customer.trim(), address: address.trim(), phone: phone.trim() },
      items: lines, subtotal, deliveryFee: subtotal >= 499 ? 0 : 39, total: subtotal + (subtotal >= 499 ? 0 : 39),
      status: statuses[0], statusHistory: [{ status: statuses[0], at: new Date().toISOString() }],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    orderMap.set(order.id, order);
    return order;
  },
  getOrder(id) { return orderMap.get(id); },
  listOrders() { return [...orderMap.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); },
  updateStatus(id, status) {
    const order = orderMap.get(id);
    if (!order) return undefined;
    order.status = status;
    order.statusHistory.push({ status, at: new Date().toISOString() });
    order.updatedAt = new Date().toISOString();
    return order;
  },
  deleteOrder(id) { return orderMap.delete(id); },
  clear() { orderMap.clear(); }
};
