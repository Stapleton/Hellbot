/** @format */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DJS = require("discord.js");
const Musicbot_1 = require("../Musicbot");
class SongEmbed {
  constructor(Message, Song, Action) {
    this.LOGGER = Musicbot_1.Musicbot.getLogger();
    let embed = new DJS.RichEmbed();
    embed.setAuthor(`Requested by: ${Song.RequestedBy}`);
    embed.setColor("RANDOM");
    embed.setURL(Song.URL);
    embed.setTitle(Action);
    embed.setDescription(Song.Name);
    embed.setImage(Song.Thumbnail);
    embed.addField("Queue ID", Song.ID, true);
    embed.addField("Channel", Song.Channel, true);
    embed.addField("Length", Song.Length, true);
    try {
      this.handleSuccess(embed, Message);
    } catch (error) {
      this.handleError(error, Message);
    }
  }
  handleSuccess(Embed, Message) {
    Message.channel.send(Embed);
  }
  handleError(Error, Message) {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.LOGGER.error(Error);
  }
}
exports.SongEmbed = SongEmbed;
class QueueEmbed {
  constructor(Message, Queue) {
    this.LOGGER = Musicbot_1.Musicbot.getLogger();
    let embed = new DJS.RichEmbed();
    embed.setAuthor("Queue List");
    embed.setColor("RANDOM");
  }
}
exports.QueueEmbed = QueueEmbed;
