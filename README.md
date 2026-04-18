# Perpetual DEX Matching Engine

A production-credible, low-latency **perpetual DEX matching engine** built with **Node.js + TypeScript**, designed to demonstrate **deterministic execution, exchange-grade architecture, and real-time systems design**.

---

## Overview

This project implements a simplified but **correct and extensible matching engine** inspired by real-world exchange infrastructure.

The system prioritizes:

* deterministic order execution
* strict price-time priority
* low-latency processing
* real-time event streaming
* observable system performance

---

## Core Features

### Matching Engine

* Price-time priority (FIFO within price level)
* Partial fills with correct residual handling
* Maker price execution (resting order price)
* Deterministic execution flow

---

### Order Book (Advanced Design)

* Price-level architecture:

  * `Map<price, FIFO queue>`
* Guarantees:

  * O(1) best bid/ask access
  * strict FIFO ordering within price levels
* Efficient removal of filled orders

---

### Order Lifecycle

```text
CREATE → MATCH → PARTIAL FILL → REST → CANCEL
```

* Supports full lifecycle including cancellation
* Idempotent order submission

---

### API Layer

* `POST /order` → place order
* `DELETE /order/:id` → cancel order
* `GET /orderbook` → full snapshot
* `GET /trades` → executed trades
* `GET /metrics` → system performance

---

### Real-Time Streaming

* WebSocket endpoint: `/ws`
* Streams:

  * trades
  * orderbook updates

Event-driven architecture using an internal **event bus**.

---

### System Guarantees

* Deterministic matching (single-threaded execution)
* Strict price-time priority
* Monotonic sequence numbers for:

  * ordered event delivery
  * deterministic replay
  * client-side consistency

---

### Rate Limiting

* Token bucket per IP
* Burst-friendly design
* Prevents API abuse without affecting trading bursts

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

### Buy Orders

* Match against lowest ask
* Condition: `ask.price <= buy.price`

### Sell Orders

* Match against highest bid
* Condition: `bid.price >= sell.price`

### Trade Price

* Executed at **resting order price (maker price)**

---

## Sequence Numbers

Each trade and orderbook update includes a **monotonic sequenceId**:

* Ensures strict ordering of events
* Enables deterministic replay
* Allows clients to detect missed updates

---

## Performance & Observability

The engine includes built-in **latency instrumentation** using high-resolution timers (`process.hrtime.bigint()`).

### Metrics Exposed

* `totalOrders` — total processed orders
* `avgLatencyMs` — average latency per order
* `lastLatencyMs` — most recent latency
* `tradesCount` — total executed trades

### Metrics Endpoint

```bash
curl http://localhost:3000/metrics
```

### Example Output

```json
{
  "totalOrders": 1000,
  "avgLatencyMs": 0.08,
  "lastLatencyMs": 0.09,
  "tradesCount": 500
}
```

### Notes

* Latency measured per order processing cycle
* In-memory processing enables **sub-millisecond latency locally**
* Does not include network or distributed system overhead

---

## Tech Stack

* Node.js
* TypeScript
* Fastify
* WebSockets (`@fastify/websocket`)

---

## Running the Project

```bash
npm install
npm run dev
```

Server runs at:

```
http://localhost:3000
```

---

## API Usage

### Place Order

```bash
curl -X POST http://localhost:3000/order \
-H "Content-Type: application/json" \
-d '{"id":"1","side":"buy","price":100,"quantity":5}'
```

---

### Cancel Order

```bash
curl -X DELETE http://localhost:3000/order/1
```

---

### Get Orderbook

```bash
curl http://localhost:3000/orderbook
```

---

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

### MVP Decisions

* In-memory state (no persistence)
* Single-threaded execution model
* Full snapshot streaming (no diff compression)

### Production Considerations

* Distributed matching engine
* Persistent event sourcing (Kafka / logs)
* Snapshot + incremental (delta) updates
* Horizontal scaling
* Fault tolerance and replication

---

## Future Improvements

* Market orders
* Order amendments
* Persistent order log
* Latency percentiles (p95 / p99)
* Prometheus / OpenTelemetry integration
* Multi-asset support

---

## Why This Project Matters

This project demonstrates:

* backend systems design
* low-latency architecture
* deterministic state machines
* real-time event streaming
* observability and performance measurement

---

## Author

Samar Abbas
Backend Systems Engineer | Distributed Systems | Web3
