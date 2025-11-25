import { CustomClient } from "@/client";
import { Events, PresenceUpdateStatus, ActivityType, GatewayIntentBits } from "discord.js";
import { config } from "@/config";
import { deployCommands } from "@/handlers/commandHandler";
import chalk from "chalk";

const client = new CustomClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
});

client.once(Events.ClientReady, () => {
  client.user?.setPresence({
    activities: [{ name: "your notifications", type: ActivityType.Listening }],
    status: PresenceUpdateStatus.Idle,
  });

  deployCommands(client);

  console.log(chalk.blue(`Logged in as ${client.user?.tag}`));
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.log(chalk.red(`No command found for ${interaction.commandName}`));
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}:`, error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
    } else {
      await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
  }
});

client.login(config.APP_TOKEN);
