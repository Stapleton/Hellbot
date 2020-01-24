/** @format */

import * as DJS from "discord.js";
import { Signale } from "signale";

import { Lib as Library } from "@Lib/Lib";
import { Song } from "@Lib/Song";

export class TestEmbed {
  private Logger: Signale = Library.getLogger();

  // Fake song object to test the embedding
  private Song: Song = {
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

  constructor(Message: DJS.Message) {
    let embed: DJS.RichEmbed = new DJS.RichEmbed();

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

  private handleSuccess(Embed: DJS.RichEmbed, Message: DJS.Message): void {
    Message.channel.send(Embed);
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.Logger.error(Error);
  }
}
