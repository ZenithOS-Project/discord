import { Events, ActivityType, PresenceUpdateStatus } from "discord.js";
import { CustomClient } from "@/client";
import { deployCommands } from "@/handlers/commandHandler";
import chalk from "chalk";
import { startServer } from "../notificationServer";

export default {
  name: Events.ClientReady,
  once: true,
  execute: async (client: CustomClient) => {
    client.user?.setPresence({
      activities: [{ name: "your notifications", type: ActivityType.Listening }],
      status: PresenceUpdateStatus.Idle,
    });

    deployCommands(client);
    startServer();

    console.log(chalk.green(`[Bot] Logged in as ${client.user?.tag}`));
  },
};
