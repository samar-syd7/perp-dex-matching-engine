import { FastifyInstance } from "fastify";
import { eventBus } from "../store/eventBus";

export async function wsRoutes(fastify: FastifyInstance) {
  fastify.get("/ws", { websocket: true }, (connection) => {
    const ws = connection.socket;

    const tradeHandler = (trade: any) => {
      ws.send(JSON.stringify({ type: "trade", data: trade }));
    };

    const orderbookHandler = (data: any) => {
      ws.send(JSON.stringify({ type: "orderbook", data }));
    };

    eventBus.on("trade", tradeHandler);
    eventBus.on("orderbook", orderbookHandler);

    ws.on("close", () => {
      eventBus.off("trade", tradeHandler);
      eventBus.off("orderbook", orderbookHandler);
    });
  });
}