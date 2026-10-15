
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { repository, statuses } from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDist = path.resolve(
  __dirname,
  '../../client/dist'
);

const orderInput = z.object({
  customer: z.string().trim().min(2).max(80),
  address: z.string().trim().min(8).max(240),
  phone: z.string().trim().regex(/^\+?[0-9()\-\s]{8,20}$/),
  items: z.array(
    z.object({
      itemId: z.string().min(1),
      quantity: z.number().int().min(1).max(20)
    })
  ).min(1).max(30)
});

export function createApp() {
  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        "img-src": ["'self'", "data:", "https:"]
      }
    }
  }));

  // CORS for local development
  app.use(cors({
    origin: process.env.CLIENT_ORIGIN
      ?.split(',')
      .map(value => value.trim())
      || 'http://localhost:5173'
  }));

  app.use(express.json({ limit: '32kb' }));

  // ==========================
  // API ROUTES
  // ==========================

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Get menu
  app.get('/api/menu', (_req, res) => {
    res.json({
      items: repository.getMenu()
    });
  });

  // Get individual menu item
  app.get('/api/menu/:id', (req, res) => {
    const item = repository.getMenuItem(req.params.id);

    return item
      ? res.json({ item })
      : res.status(404).json({
          error: 'Menu item not found'
        });
  });

  // Create order
  app.post('/api/orders', (req, res) => {
    const parsed = orderInput.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: 'Please check your details and order items.',
        details: parsed.error.flatten()
      });
    }

    const resolved = [];

    for (const line of parsed.data.items) {
      const menuItem = repository.getMenuItem(line.itemId);

      if (!menuItem) {
        return res.status(400).json({
          error: `Menu item unavailable: ${line.itemId}`
        });
      }

      resolved.push({
        menuItem,
        quantity: line.quantity
      });
    }

    const order = repository.createOrder({
      ...parsed.data,
      items: resolved
    });

    return res.status(201).json({ order });
  });

  // Get all orders
  app.get('/api/orders', (_req, res) => {
    res.json({
      orders: repository.listOrders()
    });
  });

  // Get individual order
  app.get('/api/orders/:id', (req, res) => {
    const order = repository.getOrder(req.params.id);

    return order
      ? res.json({ order })
      : res.status(404).json({
          error: 'Order not found'
        });
  });

  // Update order status
  app.patch('/api/orders/:id/status', (req, res) => {
    const nextStatus = z.object({
      status: z.enum(statuses)
    }).safeParse(req.body);

    if (!nextStatus.success) {
      return res.status(400).json({
        error: 'Invalid order status'
      });
    }

    const order = repository.getOrder(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }

    const currentIndex = statuses.indexOf(order.status);
    const nextIndex = statuses.indexOf(
      nextStatus.data.status
    );

    if (nextIndex !== currentIndex + 1) {
      return res.status(409).json({
        error: 'Orders can only advance to the next status.'
      });
    }

    return res.json({
      order: repository.updateStatus(
        order.id,
        nextStatus.data.status
      )
    });
  });

  // Delete order
  app.delete('/api/orders/:id', (req, res) => {
    return repository.deleteOrder(req.params.id)
      ? res.status(204).end()
      : res.status(404).json({
          error: 'Order not found'
        });
  });

  // Unknown API routes
  app.use('/api', (_req, res) => {
    res.status(404).json({
      error: 'API route not found'
    });
  });

  // ==========================
  // REACT FRONTEND
  // ==========================

  // Serve compiled React files
  app.use(express.static(clientDist));

  // React Router fallback - Express 5
  app.get('/{*path}', (req, res) => {
    res.sendFile(
      path.join(clientDist, 'index.html')
    );
  });

  // ==========================
  // ERROR HANDLING
  // ==========================

  app.use((error, _req, res, _next) => {
    if (
      error instanceof SyntaxError &&
      'body' in error
    ) {
      return res.status(400).json({
        error: 'Malformed JSON body'
      });
    }

    console.error(error);

    return res.status(500).json({
      error: 'Unexpected server error'
    });
  });

  return app;
}
