/** @format */

import * as DJS from "discord.js";
import { Signale } from "signale";

import { Discord as DiscordService } from "@Services/Discord";
import * as Lang from "@Lib/Lang";
import { CheckForVC } from "@Lib/CheckForVC";

export class Join {
  private Logger: Signale = DiscordService.getLogger();

  constructor(Message: DJS.Message) {
    if (CheckForVC(Message) == false) return;

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
    Message.channel.send(`${Lang.ERROR_MSG} \`${Error.message}\``);
    this.Logger.error(Error);
  }
}
