/** @format */

import { Signale } from "signale";
import * as DJS from "discord.js";

import { Discord as DiscordService } from "@Services/Discord";
import { Utils } from "@Plugins/Utils";
import * as Lang from "@Lib/Lang";

export class ServerDeafen {
  private Logger: Signale = Utils.getLogger();

  constructor(Message: DJS.Message) {
    let state: DJS.VoiceState = Message.member.voice;
    try {
      state.serverDeaf ? state.setDeaf(false) : state.setDeaf(true);
      this.handleSuccess(Message);
    } catch (e) {
      this.handleError(e, Message);
    }
  }

  private async handleSuccess(Message: DJS.Message): Promise<void> {
    Message.react(":ok_hand:").catch(e => this.handleError(e, Message));
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`${Lang.ERROR_MSG} \`${Error.message}\``);
    this.Logger.error(Error);
  }
}
