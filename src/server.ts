import Fastify from "fastify";
import websocket from "@fastify/websocket";
import { routes } from "./api/routes";
import { wsRoutes } from "./api/ws";
import { rateLimiter } from "./middleware/rateLimiter";

const app = Fastify({ logger: true });

app.register(websocket);
app.register(wsRoutes);

/**
 * Apply rate limiting to HTTP routes ONLY
 */
app.addHook("preHandler", (request, reply, done) => {
  // Skip WebSocket upgrade requests
  const requestPath = (request as any).routerPath ?? request.raw.url?.split("?")[0];
  if (requestPath === "/ws") {
    return done();
  }

  rateLimiter(request, reply, done);
});

app.register(routes);

app.get("/", async () => {
  return { status: "engine running" };
});

app.listen({
  port: Number(process.env.PORT) || 3000,
  host: "0.0.0.0"
});