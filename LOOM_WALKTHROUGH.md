# Loom walkthrough script (about 5 minutes)

## 0:00–0:25 — Opening

“Hi, I’m Kaushal. This is my full-stack food ordering assessment. I built a customer-facing menu and checkout flow with a React and Vite frontend, and an Express REST API. I’ll show the customer journey, the API and validation, and the tests.”

## 0:25–1:30 — Show the app

“This is the menu page. A customer can browse the available items, add them to the cart, and change quantities. I’ll add a couple of items and open checkout. The form collects the delivery details, and the order total is calculated by the backend from the menu data, so the browser does not decide the prices.”

Demo: add items, adjust a quantity, open checkout, enter valid sample details, and place the order. Avoid showing real personal information; use clearly fictional details.

## 1:30–2:35 — Track the order

“After checkout, the app displays an order confirmation and tracks its status. The demo advances through Order Received, Preparing, Out for Delivery, and Delivered. The client polls the order endpoint while this tracker is open. This is a simple assessment-friendly simulation; a production app could use server-sent events or WebSockets for live updates.”

Demo: point out the order number and status history. If the status advances quickly, explain the progression rather than waiting for every stage.

## 2:35–3:45 — Explain the API and storage

“The API has routes for the menu and for creating, reading, updating, and deleting orders. Checkout input is validated on the server, including customer details, item IDs, and quantities. The server looks up each item in its menu data and calculates line totals, delivery fee, and the final total itself. Invalid input or unavailable items are rejected.”

“For this test feature, menu items are seed data and orders are held in an in-memory Map. That keeps setup small and meets the brief’s simple-storage option. Orders reset when the server restarts. The repository boundary makes it straightforward to replace this with a database if persistence is required.”

## 3:45–4:35 — Show code organization and tests

“The client UI is under `client/src`, and the API, in-memory repository, and status simulator are under `server/src`. I’ve kept the API handlers separate from the repository and simulator. The tests cover order creation and lifecycle, validation errors, server-calculated totals, menu rendering, cart quantity changes, and checkout validation.”

Demo: show the relevant files briefly, then run `npm test`. If you already ran it before recording, show the passing output and say when you ran it.

## 4:35–5:00 — Close

“For development, use Node.js 20 or newer, run `npm install`, then `npm run dev` from the project root. For a single-service run or deployment, run `npm run build` and then `npm start`; Express serves both the storefront and `/api` on port 4000. The README includes the deployment commands. For a production version, I’d add persistent database storage, authenticated staff controls for status changes, and real-time status delivery. Thank you.”

## Recording checklist

- Start with the app already running and the browser on the menu page.
- Use fictional checkout details and keep notifications/private tabs out of view.
- Have a terminal ready at the project root for `npm test`.
- Keep the code tour focused on `server/src/app.js`, `server/src/store.js`, and the client flow.
- Be accurate about what you implemented and tested; mention any AI assistance if asked or required by the assessment.
