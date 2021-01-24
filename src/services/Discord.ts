/** @format */

import * as DJS from "discord.js";
import { Signale } from "signale";
import chalk from "chalk";

import * as Lang from "@Lib/Lang";
import { GetChannelNameFromGuild } from "@Lib/GetChannelNameFromGuild";

export class Discord extends DJS.Client {
  private static instance: Discord;

  private static Logger: Signale = new Signale({
    scope: "Discord",
  });

  // Private constructor, this is a singleton class
  private constructor() {
    super();
    this.login(process.env.DISCORD);
    this.on("ready", this.handleSuccess);
    this.on("error", this.handleError);
    this.on("message", (message) => {
      if (!message.content.startsWith(".")) return;
      Discord.Logger.scope("@");
      Discord.Logger.info(
        chalk.yellow`[${message.guild.name}] ${message.author.username} 
        ${message.guild.channels.resolveID(message.channel.id)}: ${message.content}`
      );
      Discord.Logger.unscope();
    });
  }

  private handleSuccess(): void {
    return Discord.Logger.success(`${Lang.INIT_SERVICE} ${Discord.name}`);
  }

  private handleError<T>(error: T): void {
    return Discord.Logger.error(error);
  }

  public static getLogger(): Signale {
    return Discord.Logger;
  }

  public static getInstance(): Discord {
    if (!Discord.instance) {
      Discord.instance = new Discord();
    }

    return Discord.instance;
  }
}
