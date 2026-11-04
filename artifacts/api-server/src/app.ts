import express, { type Express } from "express";
import path from "node:path";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import router from "./routes";
import { logger } from "./lib/logger";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());
app.use(cors({ credentials: true, origin: true }));
app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Serve the built website and API from one origin on a full-stack host.
if (process.env.SERVE_WEB_APP === "true") {
  const webRoot = path.resolve(process.cwd(), "artifacts/turki-official-page/dist/public");
  app.use(express.static(webRoot));
  app.get("/{*path}", (req, res, next) => {
    if (path.extname(req.path)) return next();
    res.sendFile(path.join(webRoot, "index.html"));
  });
}

export default app;
