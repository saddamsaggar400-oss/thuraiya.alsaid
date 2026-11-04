import app from "./app";
import { logger } from "./lib/logger";
import { cleanupOrphanedMedia } from "./lib/mediaCleanup";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "@workspace/db";
import { fileURLToPath } from "node:url";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function start(): Promise<void> {
  if (process.env.RUN_DATABASE_MIGRATIONS === "true") {
    await migrate(db, {
      migrationsFolder: fileURLToPath(new URL("./drizzle", import.meta.url)),
    });
    logger.info("Database migrations completed");
  }

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });

  scheduleOrphanedMediaCleanup();
}

const mediaCleanupIntervalMs = 15 * 60 * 1000;

function scheduleOrphanedMediaCleanup(): void {
  void cleanupOrphanedMedia()
    .catch((error) => {
      logger.error({ err: error }, "Orphaned media cleanup failed");
    })
    .finally(() => {
      const mediaCleanupTimer = setTimeout(
        scheduleOrphanedMediaCleanup,
        mediaCleanupIntervalMs,
      );
      mediaCleanupTimer.unref();
    });
}

void start().catch(async (error) => {
  logger.error({ err: error }, "Server startup failed");
  await pool.end();
  process.exit(1);
});
