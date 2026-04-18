import Fastify from "fastify";
import websocket from "@fastify/websocket";
import { routes } from "./api/routes";
import { eventBus } from "./store/eventBus";

const app = Fastify({ logger: true });

app.register(websocket);
app.register(routes);

/**
 * WebSocket endpoint
 */
app.get("/ws", { websocket: true }, (connection, req) => {
  const socket = connection.socket;

  const tradeHandler = (trade: any) => {
    socket.send(JSON.stringify({ type: "trade", data: trade }));
  };

  const orderbookHandler = (data: any) => {
    socket.send(JSON.stringify({ type: "orderbook", data }));
  };

  eventBus.on("trade", tradeHandler);
  eventBus.on("orderbook", orderbookHandler);

  socket.on("close", () => {
    eventBus.off("trade", tradeHandler);
    eventBus.off("orderbook", orderbookHandler);
  });
});

app.get("/", async () => {
  return { status: "engine running" };
});

app.listen({ port: 3000, host: "0.0.0.0" });