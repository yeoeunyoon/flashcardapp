import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import app from "./app";

app.use('*', cors());

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
