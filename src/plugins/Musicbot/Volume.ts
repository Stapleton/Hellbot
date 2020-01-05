import * as DJS from 'discord.js';
import { Musicbot } from '../Musicbot';
import { Lib } from '../../lib/Lib';

export class Volume {
  private LOGGER = Musicbot.getLogger();

  constructor(Message: DJS.Message) {
    if (Lib.checkForVC(Message) == false) return;
    
    let vol = Message.content.split(' ')[1];
    if (typeof vol === 'undefined') {
      Message.channel.send(`Current Volume: ${Message.guild.voiceConnection.dispatcher.volumeDecibels.toString().substr(0, 5)}dB`);
    } else {
      if (Number(vol) > 50 || Number(vol) < -50) {
        Message.channel.send(`Can't really get any spicier... (Volume Cap is -50dB to 50dB)`);
        return;
      }
      try {
        // TODO: Modified volume level should persist between audio streams instead of defaulting when a new song starts
        Message.guild.voiceConnection.dispatcher.setVolumeDecibels(Number(vol));
        this.handleSuccess(Message);
      } catch (e) {
        this.handleError(e, Message);
      }
    }
  }

  private handleSuccess(Message: DJS.Message) {
    Message.channel.send(`Volume set to ${Message.guild.voiceConnection.dispatcher.volumeDecibels.toString().substr(0, 5)}dB`);
  }

  private handleError(Error: Error, Message: DJS.Message) {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.LOGGER.error(Error);
  }
}
