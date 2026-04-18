import Fastify from "fastify";
import websocket from "@fastify/websocket";
import { routes } from "./api/routes";
import { wsRoutes } from "./api/ws";

const app = Fastify({ logger: true });

// Register websocket FIRST
app.register(websocket);

// Then register WS routes
app.register(wsRoutes);

// Then REST routes
app.register(routes);

app.get("/", async () => {
  return { status: "engine running" };
});

app.listen({ port: 3000, host: "0.0.0.0" });