import * as DJS from 'discord.js';
import { Signale } from 'signale';
import * as Lang from '../lib/Lang';

export class Discord extends DJS.Client {
  private static instance: Discord;

  protected static LOGGER = new Signale({
    scope: "Discord"
  });

  // Private constructor, this is a singleton class
  private constructor() {
    super();
    this.login(process.env.DISCORD);
    this.on("ready", this.handleConnect);
    this.on("error", this.handleError);
  }

  private handleConnect(): void {
    return Discord.LOGGER.success(`${Lang.INIT_SERVICE} ${Discord.name}`);
  }

  private handleError<T>(error: T): void {
    return Discord.LOGGER.error(error);
  }

  public static getInstance(): Discord {
    if (!Discord.instance) {
      Discord.instance = new Discord();
    }

    return Discord.instance;
  }
}
