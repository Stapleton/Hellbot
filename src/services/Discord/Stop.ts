/** @format */

import * as DJS from "discord.js";
import { Signale } from "signale";

import { Discord as DiscordService } from "@Services/Discord";
import * as Lang from "@Lib/Lang";
import { CheckForVC } from "@Lib/CheckForVC";

const Discord = DiscordService.getInstance();

export class Stop {
  private Logger: Signale = DiscordService.getLogger();
  private vonn: DJS.VoiceConnection;

  constructor(Message: DJS.Message) {
    if (CheckForVC(Message) == false) return;

    this.vonn = Discord.voice.connections.get(Message.guild.id);

    try {
      this.vonn.dispatcher.end();
      this.handleSuccess(Message);
    } catch (e) {
      this.handleError(e, Message);
    }
  }

  private handleSuccess(Message: DJS.Message): void {
    Message.channel.send(`Stopped`);
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`${Lang.ERROR_MSG} \`${Error.message}\``);
    this.Logger.error(Error);
  }
}
