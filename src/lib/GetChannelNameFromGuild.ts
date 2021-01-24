/** @format */

import * as DJS from "discord.js";

export class GetChannelNameFromGuild {
  constructor(message: DJS.Message) {
    return message.guild.channels.resolveID(message.channel.id);
  }
}
