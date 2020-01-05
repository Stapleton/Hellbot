import * as DJS from 'discord.js';
import { Musicbot } from '../Musicbot';
import { Lib } from '../../lib/Lib';

export class Leave {
  private LOGGER = Musicbot.getLogger();

  constructor(Message: DJS.Message) {
    if (Lib.checkForVC(Message) == false) return;
    
    try {
      Message.client.voiceConnections.get(Message.guild.id).disconnect();
      this.handleSuccess(Message);
    } catch (error) {
      this.handleError(error, Message);
    }
  }

  private handleSuccess(Message: DJS.Message) {
    Message.channel.send(`Disconnected`);
  }

  private handleError(Error: Error, Message: DJS.Message) {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.LOGGER.error(Error);
  }
}
