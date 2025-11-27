import { CustomClient } from "@/client";
import { GatewayIntentBits } from "discord.js";
import { config } from "@/config";
import { loadEvents } from "@/handlers/eventHandler";

export const client = new CustomClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
});

loadEvents(client);

client.login(config.APP_TOKEN);
