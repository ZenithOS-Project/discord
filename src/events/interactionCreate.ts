import { Events } from "discord.js";
import { CustomClient } from "@/client";
import chalk from "chalk";

export default {
  name: Events.InteractionCreate,
  execute: async (interaction: any, client: CustomClient) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
      console.log(chalk.red(`[Bot] No command found for ${interaction.commandName}`));
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(chalk.red(`[Bot] Error executing ${interaction.commandName}:`), error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
      } else {
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
      }
    }
  },
};
