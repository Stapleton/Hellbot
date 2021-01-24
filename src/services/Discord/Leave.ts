/** @format */

import * as DJS from "discord.js";
import { Signale } from "signale";

import { Discord as DiscordService } from "@Services/Discord";
import * as Lang from "@Lib/Lang";
import { CheckForVC } from "@Lib/CheckForVC";

const Discord = DiscordService.getInstance();

export class Leave {
  private Logger: Signale = DiscordService.getLogger();
  private vonn: DJS.VoiceConnection;

  constructor(Message: DJS.Message) {
    if (CheckForVC(Message) == false) return;

    this.vonn = Discord.voice.connections.get(Message.guild.id);

    try {
      this.vonn.channel.leave();
      this.handleSuccess(Message);
    } catch (error) {
      this.handleError(error, Message);
    }
  }

  private handleSuccess(Message: DJS.Message): void {
    Message.channel.send(`Disconnected`);
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`${Lang.ERROR_MSG} \`${Error.message}\``);
    this.Logger.error(Error);
  }
}
