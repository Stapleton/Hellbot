/** @format */

import * as DJS from "discord.js";
import { Signale } from "signale";

import { Musicbot } from "@Plugins/Musicbot";
import * as Lang from "@Lib/Lang";
import { Song, QueueItem } from "@Lib/Types";

export class SongEmbed {
  private Logger: Signale = Musicbot.getLogger();

  constructor(Message: DJS.Message, Song: Song, Action: string) {
    let embed: DJS.MessageEmbed = new DJS.MessageEmbed();

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

  private handleSuccess(Embed: DJS.MessageEmbed, Message: DJS.Message): void {
    Message.channel.send(Embed);
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`${Lang.ERROR_MSG} \`${Error.message}\``);
    this.Logger.error(Error);
  }
}

export class QueueEmbed {
  private Logger: Signale = Musicbot.getLogger();

  constructor(Message: DJS.Message, Queue?: QueueItem[]) {
    let embed: DJS.MessageEmbed = new DJS.MessageEmbed();

    embed.setAuthor("Queue List");
    embed.setColor("RANDOM");

    Queue.forEach(Item => {
      embed.addField(Item.Name, `${Item.Length} // ${Item.ID}`, true);
    });

    try {
      this.handleSuccess(embed, Message);
    } catch (error) {
      this.handleError(error, Message);
    }
  }

  private handleSuccess(Embed: DJS.MessageEmbed, Message: DJS.Message): void {
    Message.channel.send(Embed);
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`${Lang.ERROR_MSG} \`${Error.message}\``);
    this.Logger.error(Error);
  }
}
