/** @format */

import * as DJS from "discord.js";
import { Signale } from "signale";
import * as Lang from "@Lib/Lang";
import { Lib } from "@Lib/Lib";

export class Discord extends DJS.Client {
  private static instance: Discord;

  private static Logger: Signale = new Signale({
    scope: "Discord",
  });

  // Private constructor, this is a singleton class
  private constructor() {
    super();
    this.login(process.env.DISCORD);
    this.on("ready", this.handleConnect);
    this.on("error", this.handleError);
  }

  private handleConnect(): void {
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

export class Join {
  private Logger: Signale = Discord.getLogger();

  constructor(Message: DJS.Message) {
    if (Lib.checkForVC(Message) == false) return;

    // Return if already connected to a voice channel
    if (Message.guild.voiceConnection) return;
    Message.guild
      .member(Message.author)
      .voiceChannel.join()
      .then(() => this.handleSuccess(Message))
      .catch(error => this.handleError(error, Message));
  }

  private handleSuccess(Message: DJS.Message): void {
    Message.channel.send(`Connected`);
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.Logger.error(Error);
  }
}

export class Leave {
  private Logger: Signale = Discord.getLogger();

  constructor(Message: DJS.Message) {
    if (Lib.checkForVC(Message) == false) return;

    try {
      Message.client.voiceConnections.get(Message.guild.id).disconnect();
      this.handleSuccess(Message);
    } catch (error) {
      this.handleError(error, Message);
    }
  }

  private handleSuccess(Message: DJS.Message): void {
    Message.channel.send(`Disconnected`);
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.Logger.error(Error);
  }
}

export class Stop {
  private Logger: Signale = Discord.getLogger();

  constructor(Message: DJS.Message) {
    if (Lib.checkForVC(Message) == false) return;

    try {
      Message.guild.voiceConnection.dispatcher.end();
      this.handleSuccess(Message);
    } catch (e) {
      this.handleError(e, Message);
    }
  }

  private handleSuccess(Message: DJS.Message): void {
    Message.channel.send(`Stopped`);
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.Logger.error(Error);
  }
}

export class Volume {
  private Logger: Signale = Discord.getLogger();

  constructor(Message: DJS.Message) {
    if (Lib.checkForVC(Message) == false) return;

    let vol = Message.content.split(" ")[1];
    if (typeof vol === "undefined") {
      Message.channel.send(
        `Current Volume: ${Message.guild.voiceConnection.dispatcher.volumeDecibels
          .toString()
          .substr(0, 5)}dB`
      );
    } else {
      if (Number(vol) > 50 || Number(vol) < -50) {
        Message.channel.send(
          `Can't really get any spicier... (Volume Cap is -50dB to 50dB)`
        );
        return;
      }
      try {
        // TODO: Modified volume level should persist between audio streams instead of defaulting when a new song starts
        Message.guild.voiceConnection.dispatcher.setVolumeDecibels(Number(vol));
        this.handleSuccess(Message);
      } catch (e) {
        this.handleError(e, Message);
      }
    }
  }

  private handleSuccess(Message: DJS.Message): void {
    Message.channel.send(
      `Volume set to ${Message.guild.voiceConnection.dispatcher.volumeDecibels
        .toString()
        .substr(0, 5)}dB`
    );
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.Logger.error(Error);
  }
}

export class Pause {
  private Logger: Signale = Discord.getLogger();

  constructor(Message: DJS.Message) {
    if (Lib.checkForVC(Message) == false) return;

    try {
      Message.guild.voiceConnection.dispatcher.pause();
      this.handleSuccess(Message);
    } catch (e) {
      this.handleError(e, Message);
    }
  }

  private handleSuccess(Message: DJS.Message): void {
    Message.channel.send(`Paused`);
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.Logger.error(Error);
  }
}

export class Resume {
  private Logger: Signale = Discord.getLogger();

  constructor(Message: DJS.Message) {
    if (Lib.checkForVC(Message) == false) return;

    try {
      Message.guild.voiceConnection.dispatcher.resume();
      this.handleSuccess(Message);
    } catch (e) {
      this.handleError(e, Message);
    }
  }

  private handleSuccess(Message: DJS.Message): void {
    Message.channel.send(`Paused`);
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.Logger.error(Error);
  }
}
