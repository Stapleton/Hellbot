import * as DJS from 'discord.js';
import { Musicbot } from '../Musicbot';
import { Song } from '../../lib/Song';

export class SongEmbed {
  private LOGGER = Musicbot.getLogger();

  constructor(Message: DJS.Message, Song: Song, Action: string) {
    let embed = new DJS.RichEmbed();

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

  private handleSuccess(Embed: DJS.RichEmbed, Message: DJS.Message) {
    Message.channel.send(Embed);
  }

  private handleError(Error: Error, Message: DJS.Message) {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.LOGGER.error(Error);
  }
}

export class QueueEmbed {
  private LOGGER = Musicbot.getLogger();

  constructor(Message: DJS.Message, Queue: object) {
    let embed = new DJS.RichEmbed();

    embed.setAuthor("Queue List");
    embed.setColor("RANDOM");
    // TODO: Finish Queue List Embed
  }
}
