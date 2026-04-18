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
app.get("/ws", { websocket: true }, (connection, request) => {
  const ws = connection.socket;

  // sanity check
  if (!ws || typeof ws.send !== "function") {
    console.error("Invalid WebSocket object");
    return;
  }

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

app.get("/", async () => {
  return { status: "engine running" };
});

app.listen({ port: 3000, host: "0.0.0.0" });