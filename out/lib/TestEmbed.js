/** @format */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DJS = require("discord.js");
const Lib_1 = require("./Lib");
class TestEmbed {
  constructor(Message) {
    this.LOGGER = Lib_1.Lib.getLogger();
    this.Song = {
      ID: 13378675309,
      URL: "https://www.youtube.com/watch?v=QsC6pfLisU4",
      Search: "You didn't search anything.",
      RequestedBy: "Whoever ran the command.",
      Length: "69:42:00",
      Name: "Is the safe done?",
      Thumbnail:
        "https://cdn.discordapp.com/attachments/595858296385175552/653684368354705408/circle_game-1.jpg",
      Channel: ":Pog:",
      Playing: false,
    };
    let embed = new DJS.RichEmbed();
    embed.setAuthor(
      Message.client.user.username,
      Message.client.user.avatarURL
    );
    embed.setColor("RANDOM");
    embed.setURL(this.Song.URL);
    embed.setTitle(this.Song.Name);
    embed.setImage(this.Song.Thumbnail);
    embed.addField("Queue ID", this.Song.ID, true);
    embed.addField("Channel", this.Song.Channel, true);
    embed.addField("Length", this.Song.Length, true);
    embed.addField("Requested By", this.Song.RequestedBy, true);
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
exports.TestEmbed = TestEmbed;
