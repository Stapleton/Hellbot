/** @format */

import * as DJS from "discord.js";
import { Signale } from "signale";

import { Discord as DiscordService } from "@Services/Discord";
import * as Lang from "@Lib/Lang";
import { CheckForVC } from "@Lib/CheckForVC";

export class Volume {
  private Logger: Signale = DiscordService.getLogger();

  constructor(Message: DJS.Message) {
    if (CheckForVC(Message) == false) return;

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
    Message.channel.send(`${Lang.ERROR_MSG} \`${Error.message}\``);
    this.Logger.error(Error);
  }
}
