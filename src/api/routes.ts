import { FastifyInstance } from "fastify";
import { MatchingEngine } from "../engine/matchingEngine";
import { OrderBook } from "../orderbook/orderBook";
import { tradeStore } from "../store/tradeStore";
import { Order } from "../types";

/**
 * Shared state (singleton)
 */
const orderBook = new OrderBook();
const engine = new MatchingEngine(orderBook);

export async function routes(fastify: FastifyInstance) {

  /**
   * POST /order
   * - creates order
   * - runs matching immediately
   */
  fastify.post("/order", async (request, reply) => {
    const body = request.body as Partial<Order>;

    /**
     * Basic validation
     */
    if (
      !body.id ||
      !body.side ||
      typeof body.price !== "number" ||
      typeof body.quantity !== "number"
    ) {
      return reply.status(400).send({ error: "Invalid order payload" });
    }

    const order: Order = {
      id: body.id,
      side: body.side,
      price: body.price,
      quantity: body.quantity,
      remaining: body.quantity,
      timestamp: Date.now(),
    };

    engine.processOrder(order);

    return {
      status: "accepted",
      orderId: order.id,
    };
  });

  /**
   * GET /orderbook
   */
  fastify.get("/orderbook", async () => {
    return orderBook.getSnapshot();
  });

  /**
   * GET /trades
   */
  fastify.get("/trades", async () => {
    return tradeStore.getTrades();
  });

  /**
    * DELETE /order/:id
    */
   fastify.delete("/order/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    if (!id) {
        return reply.status(400).send({ error: "Order ID required" });
    }

    const success = engine.cancelOrder(id);

    if (!success) {
        return reply.status(404).send({ error: "Order not found" });
    }

    return {
        status: "cancelled",
        orderId: id,
    };
    });
}