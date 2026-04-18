# Perpetual DEX Matching Engine (MVP)

A production-credible, low-latency **perpetual DEX matching engine** built with **Node.js + TypeScript**, designed to demonstrate backend systems engineering, deterministic execution, and exchange-grade architecture.

---

## Overview

This project implements a simplified but **correct and extensible matching engine** similar to those used in centralized and decentralized exchanges.

The focus is on:

* deterministic order matching
* price-time priority
* clean system design
* real-time event streaming

---

## Core Features

### Matching Engine

* Price-time priority (FIFO within price level)
* Partial fills
* Maker price execution
* Deterministic execution

### Order Book (Advanced)

* Price-level architecture using:

  * `Map<price, FIFO queue>`
* Efficient operations:

  * O(1) best bid/ask access
  * O(1) removal at head
* Strict FIFO guarantees

### API Layer

* `POST /order` → place order
* `DELETE /order/:id` → cancel order
* `GET /orderbook` → snapshot
* `GET /trades` → executed trades

### Real-Time Streaming

* WebSocket endpoint `/ws`
* Streams:

  * trades
  * orderbook updates

### System Features

* Idempotent order processing
* Token-bucket rate limiting
* Event-driven architecture (event bus)
* Monotonic sequence numbers for:

  * deterministic replay
  * client-side consistency

---

## Architecture

```text
Client (REST / WS)
        │
        ▼
     Fastify API
        │
        ▼
 Matching Engine
        │
        ▼
   Order Book
        │
        ▼
   Event Bus ───▶ WebSocket Stream
```

---

## Matching Logic

### Buy Order

* Matches lowest ask
* Condition: `ask.price <= buy.price`

### Sell Order

* Matches highest bid
* Condition: `bid.price >= sell.price`

### Trade Price

* Executed at **resting order price (maker price)**

---

## Order Lifecycle

```text
CREATE → MATCH → PARTIAL FILL → REST → CANCEL
```

---

## Sequence Numbers

Every event is assigned a **monotonic sequenceId**:

* Ensures strict ordering
* Enables deterministic replay
* Allows clients to detect missed updates

---

## Rate Limiting

* Token bucket per IP
* Burst capacity + steady refill
* Prevents API abuse without harming trading bursts

---

## Tech Stack

* Node.js
* TypeScript
* Fastify
* WebSockets (@fastify/websocket)

---

## Running the Project

```bash
npm install
npm run dev
```

Server runs on:

```
http://localhost:3000
```

---

## API Examples

### Place Order

```bash
curl -X POST http://localhost:3000/order \
-H "Content-Type: application/json" \
-d '{"id":"1","side":"buy","price":100,"quantity":5}'
```

### Cancel Order

```bash
curl -X DELETE http://localhost:3000/order/1
```

### Get Orderbook

```bash
curl http://localhost:3000/orderbook
```

### Get Trades

```bash
curl http://localhost:3000/trades
```

---

## WebSocket Example

```js
const ws = new WebSocket("ws://localhost:3000/ws");

ws.onmessage = (msg) => {
  console.log(JSON.parse(msg.data));
};
```

---

## Design Trade-offs

### MVP Simplicity

* In-memory storage
* Single-threaded execution

### Production Considerations

* Replace in-memory store with Redis/Kafka
* Distributed matching engine
* Persistent order log
* Snapshot + delta streaming

---

## Future Improvements

* Market orders
* Order amendments
* Persistent event sourcing
* Latency benchmarking
* Horizontal scaling

---

## Why This Project Matters

This project demonstrates:

* backend systems design
* low-latency thinking
* deterministic execution
* real-time data streaming

---

## Author

Samar Abbas
Backend Systems Engineer | Distributed Systems | Web3
