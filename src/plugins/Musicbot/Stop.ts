import * as DJS from 'discord.js';
import { Musicbot } from '../Musicbot';
import { Lib } from '../../lib/Lib';

export class Stop {
  private LOGGER = Musicbot.getLogger();

  constructor(Message: DJS.Message) {
    if (Lib.checkForVC(Message) == false) return;
    
    try {
      Message.guild.voiceConnection.dispatcher.end();
      this.handleSuccess(Message);
    } catch (e) {
      this.handleError(e, Message);
    }
  }

  private handleSuccess(Message: DJS.Message) {
    Message.channel.send(`Stopped`);
  }

  private handleError(Error: Error, Message: DJS.Message) {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.LOGGER.error(Error);
  }
}
