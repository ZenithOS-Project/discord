import { client } from "@";
import chalk from "chalk";
import express from "express";

const server = express();
const port = process.env.PORT || 2227;

server.get("/", (req, res) => {
  res.send("Notification service is running.");
});

export function startServer() {
  server.listen(port, () => {
    console.log(chalk.green(`[Notification Server] listening on port ${port}`));
  });
}

server.get("/health", async (req, res) => {
  res.status(200).send("OK");

  try {
    const healthLogChannel = client.channels.cache.get("1443568191761551441");

    if (!healthLogChannel || !("send" in healthLogChannel)) {
      return;
    }

    await healthLogChannel.send({
      content: `[Health Check] Notification server is healthy at ${new Date().toISOString()}`,
    });
  } catch (error) {
    console.error(chalk.red("[Notification Server] Failed to log health check:"), error);
  }
});
