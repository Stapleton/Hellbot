import * as DJS from 'discord.js';
import { Musicbot } from '../Musicbot';
import { Lib } from '../../lib/Lib';

export class Join {
  private LOGGER = Musicbot.getLogger();

  constructor(Message: DJS.Message) {
    if (Lib.checkForVC(Message) == false) return;

    // Return if already connected to a voice channel
    if (Message.guild.voiceConnection) return;
    Message.guild.member(Message.author).voiceChannel.join()
    .then(() => this.handleSuccess(Message))
    .catch((error) => this.handleError(error, Message));
  }

  private handleSuccess(Message: DJS.Message) {
    Message.channel.send(`Connected`);
  }

  private handleError(Error: Error, Message: DJS.Message) {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.LOGGER.error(Error);
  }
}
