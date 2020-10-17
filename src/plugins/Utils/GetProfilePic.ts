/** @format */

import { Signale } from "signale";
import * as DJS from "discord.js";

import { Discord as DiscordService } from "@Services/Discord";
import { Utils } from "@Plugins/Utils";
import * as Lang from "@Lib/Lang";

type ProfilePic = {
  username: string;
  imglink: string;
};

export class GetProfilePic {
  private Logger: Signale = Utils.getLogger();

  constructor(Message: DJS.Message) {
    let Result: ProfilePic = {
      username: "",
      imglink: "",
    };

    if (Message.mentions.users.size > 0) {
      let first = Message.mentions.users.first();
      Result.username = first.username;
      Result.imglink = first.avatarURL();
    } else {
      Result.username = Message.author.username;
      Result.imglink = Message.author.avatarURL();
    }

    try {
      this.handleSuccess(Message, Result);
    } catch (e) {
      this.handleError(e, Message);
    }
  }

  private handleSuccess(Message: DJS.Message, Result: ProfilePic): void {
    Message.channel.send(
      `Requested Profile Picture for ${Result.username}\n${Result.imglink}`
    );
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`${Lang.ERROR_MSG} \`${Error.message}\``);
    this.Logger.error(Error);
  }
}
