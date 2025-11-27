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

server.get("/health", (req, res) => {
  res.status(200).send("OK");
});
