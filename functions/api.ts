import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import express from "express";
import serverless from "serverless-http";
import "dotenv/config";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

// Middleware setup
app.use(express.json({
  verify: (req, _res, buf) => {
    (req as any).rawBody = buf;
  },
}));

app.use(express.urlencoded({ extended: false }));

// Configure routes
let routesRegistered = false;

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Register routes only once (cold start optimization)
  if (!routesRegistered) {
    await registerRoutes(httpServer, app);
    routesRegistered = true;
  }

  // Create serverless handler
  const serverlessHandler = serverless(app);
  return await serverlessHandler(event, context);
};

export { handler };