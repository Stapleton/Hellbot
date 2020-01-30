/** @format */

import * as DJS from "discord.js";
import { Signale } from "signale";

import { Discord as DiscordService } from "@Services/Discord";
import * as Lang from "@Lib/Lang";
import { CheckForVC } from "@Lib/CheckForVC";

export class Leave {
  private Logger: Signale = DiscordService.getLogger();

  constructor(Message: DJS.Message) {
    if (CheckForVC(Message) == false) return;

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
    Message.channel.send(`${Lang.ERROR_MSG} \`${Error.message}\``);
    this.Logger.error(Error);
  }
}
