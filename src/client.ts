import { Client, Collection, type ClientOptions } from "discord.js";

export class CustomClient extends Client {
  commands: Collection<string, any>;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
  }
}
