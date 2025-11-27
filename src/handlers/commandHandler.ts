import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { config } from "@/config";
import chalk from "chalk";
import { CustomClient } from "@/client";

const __filename = fileURLToPath(import.meta.url as string);
const __dirname = dirname(__filename);

async function loadCommands(client: CustomClient) {
  const foldersPath = path.join(__dirname, "../commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath);
      if ("data" in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(chalk.yellow(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`));
      }
    }
  }
}

const rest = new REST().setToken(config.APP_TOKEN);

export async function deployCommands(client: CustomClient) {
  await loadCommands(client);

  try {
    const data = await rest.put(Routes.applicationGuildCommands(config.APP_ID, config.GUILD_ID), {
      body: Array.from(client.commands.values()).map((cmd) => cmd.data.toJSON()),
    });
    console.log(chalk.blue(`[Bot] Successfully reloaded ${(data as any[]).length} application (/) commands.`));
  } catch (error) {
    console.error(chalk.red(`[Bot] Error deploying commands:`), error);
  }
}
