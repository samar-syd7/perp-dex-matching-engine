import Fastify from "fastify";
import { routes } from "./api/routes";

const app = Fastify({ logger: true });

app.register(routes);

app.get("/", async () => {
  return { status: "engine running" };
});

app.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});