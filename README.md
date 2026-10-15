# Crumb & Co. — Food Order Management

A compact full-stack assessment implementation: React + Vite storefront, Express REST API, in-memory menu/order store, input validation, API and UI tests, and simulated order progress.

## Requirements

- Node.js 20+
- npm 10+

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). The API listens on `http://localhost:4000`.

To run the complete app through one server, build the frontend and start Express from the project root:

```bash
npm run build
npm start
```

Open `http://localhost:4000`. Express serves the compiled React app and the API from the same origin.

Run tests and a production frontend build:

```bash
npm test
npm run build
```

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/menu` | List menu items |
| GET | `/api/menu/:id` | Fetch one menu item |
| POST | `/api/orders` | Validate and place an order |
| GET | `/api/orders` | List orders (newest first) |
| GET | `/api/orders/:id` | Fetch order and current status |
| PATCH | `/api/orders/:id/status` | Advance status (for staff/demo use) |
| DELETE | `/api/orders/:id` | Delete an order |

New orders progress automatically through `Order Received`, `Preparing`, `Out for Delivery`, and `Delivered`. The client polls the order endpoint while the tracking panel is open. For a production system, replace in-memory storage with a database, use authenticated staff-only status updates, and publish updates over SSE or WebSockets.

## Design notes

- The API owns pricing and recomputes totals from trusted menu data; the browser never chooses the amount charged.
- Checkout validates delivery details and item IDs/quantities. Unknown or unavailable items return a client error.
- API handlers are separated from the in-memory repository and status simulation, which makes persistence and real-time transport replaceable.
- Tests cover menu retrieval, order creation/read/update/delete, invalid input, computed totals, UI menu rendering, cart quantity changes, and checkout validation.

## Single-service deployment

Deploy the project root as one Node service. Configure the host with:

- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`
- **Root directory:** the project root containing this `package.json`

The build creates `client/dist`; Express serves those static files and handles the `/api` endpoints on the same origin. No `VITE_API_URL` or `CLIENT_ORIGIN` is needed for this single-service setup. The host should provide its `PORT` environment variable. This demo intentionally uses in-memory data, so orders reset when the server restarts; add a database before treating it as a real service.

## Suggested 12–15 minute walkthrough

1. (1 min) Break down the requirements and describe the customer order flow.
2. (3 min) Walk through API routes, validation, server-owned pricing, and repository boundary.
3. (3 min) Show the menu/cart/checkout UI and responsive layout.
4. (2 min) Place an order and show the simulated status progression.
5. (3 min) Run API and UI tests; explain edge cases covered.
6. (1–2 min) Discuss the in-memory trade-off, deployment configuration, and next steps (database, authentication, real SSE/WebSockets).

Be transparent in the video about what AI helped generate or review, and mention that you ran and checked the tests yourself.
