import { readdirSync } from "fs";
import path from "path";
import { CustomClient } from "@/client";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url as string);
const __dirname = path.dirname(__filename);

export async function loadEvents(client: CustomClient) {
  const eventsPath = path.join(__dirname, "../events");

  const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith(".ts"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);

    try {
      const event = await import(filePath);
      const eventHandler = event.default;

      if (!eventHandler) {
        console.log(chalk.yellow(`[WARNING] The event file at ${filePath} is missing a default export.`));
        continue;
      }

      if (eventHandler.once) {
        console.log(chalk.magenta(`[Bot] Successfully loaded event (once): ${eventHandler.name}`));
        client.once(eventHandler.name, (...args) => eventHandler.execute(...args, client));
      } else {
        console.log(chalk.magenta(`[Bot] Successfully loaded event: ${eventHandler.name}`));
        client.on(eventHandler.name, (...args) => eventHandler.execute(...args, client));
      }
    } catch (error) {
      console.error(chalk.red(`[Bot] Error loading event file ${file}:`), error);
    }
  }
}
