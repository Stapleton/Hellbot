/** @format */

import * as DJS from "discord.js";
import { Signale } from "signale";

import { Musicbot } from "@Plugins/Musicbot";
import * as Lang from "@Lib/Lang";
import { Song } from "@Lib/Song";

export class SongEmbed {
  private Logger: Signale = Musicbot.getLogger();

  constructor(Message: DJS.Message, Song: Song, Action: string) {
    let embed: DJS.RichEmbed = new DJS.RichEmbed();

    //embed.setAuthor(Message.client.user.username, Message.client.user.avatarURL);
    embed.setAuthor(`Requested by: ${Song.RequestedBy}`);
    embed.setColor("RANDOM");
    embed.setURL(Song.URL);
    embed.setTitle(Action);
    embed.setDescription(Song.Name);
    embed.setImage(Song.Thumbnail);
    embed.addField("Queue ID", Song.ID, true);
    embed.addField("Channel", Song.Channel, true);
    embed.addField("Length", Song.Length, true);
    //embed.addField("Requested By", Song.RequestedBy, true);

    try {
      this.handleSuccess(embed, Message);
    } catch (error) {
      this.handleError(error, Message);
    }
  }

  private handleSuccess(Embed: DJS.RichEmbed, Message: DJS.Message): void {
    Message.channel.send(Embed);
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`${Lang.ERROR_MSG} \`${Error.message}\``);
    this.Logger.error(Error);
  }
}

export class QueueEmbed {
  private Logger: Signale = Musicbot.getLogger();

  constructor(Message: DJS.Message, Queue: object) {
    let embed: DJS.RichEmbed = new DJS.RichEmbed();

    embed.setAuthor("Queue List");
    embed.setColor("RANDOM");
    // TODO: Finish Queue List Embed
  }
}
