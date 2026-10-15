import { afterEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { repository } from '../src/store.js';

const api = request(createApp());
afterEach(() => repository.clear());

const validOrder = { customer: 'Kaushal Singh', address: '22 Garden Road, Gurugram', phone: '+91 9876543210', items: [{ itemId: 'margherita', quantity: 2 }] };

describe('menu API', () => {
  it('returns menu items with prices and descriptions', async () => {
    const response = await api.get('/api/menu').expect(200);
    assert.ok(response.body.items.length >= 1);
    assert.equal(response.body.items[0].available, true);
  });
  it('returns 404 for an unknown menu item', async () => api.get('/api/menu/nope').expect(404));
});

describe('order API CRUD and validation', () => {
  it('creates an order using server menu prices and retrieves it', async () => {
    const created = await api.post('/api/orders').send(validOrder).expect(201);
    const { id, total, status } = created.body.order;
    assert.equal(total, 658); // Free delivery applies above ₹499.
    assert.equal(status, 'Order Received');
    const fetched = await api.get(`/api/orders/${id}`).expect(200);
    assert.equal(fetched.body.order.customer.name, 'Kaushal Singh');
  });
  it('rejects bad delivery details, empty carts, and unknown item IDs', async () => {
    await api.post('/api/orders').send({ ...validOrder, phone: 'abc' }).expect(400);
    await api.post('/api/orders').send({ ...validOrder, items: [] }).expect(400);
    await api.post('/api/orders').send({ ...validOrder, items: [{ itemId: 'fake', quantity: 1 }] }).expect(400);
  });
  it('lists and deletes an order', async () => {
    const { body } = await api.post('/api/orders').send(validOrder).expect(201);
    const id = body.order.id;
    assert.equal((await api.get('/api/orders').expect(200)).body.orders.length, 1);
    await api.delete(`/api/orders/${id}`).expect(204);
    await api.get(`/api/orders/${id}`).expect(404);
  });
  it('advances status in order and rejects skipped transitions', async () => {
    const { body } = await api.post('/api/orders').send(validOrder).expect(201);
    const id = body.order.id;
    await api.patch(`/api/orders/${id}/status`).send({ status: 'Out for Delivery' }).expect(409);
    const updated = await api.patch(`/api/orders/${id}/status`).send({ status: 'Preparing' }).expect(200);
    assert.equal(updated.body.order.statusHistory.length, 2);
  });
});
