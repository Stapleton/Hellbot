/** @format */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Musicbot_1 = require("../Musicbot");
const Lib_1 = require("../../lib/Lib");
class Volume {
  constructor(Message) {
    this.LOGGER = Musicbot_1.Musicbot.getLogger();
    if (Lib_1.Lib.checkForVC(Message) == false) return;
    let vol = Message.content.split(" ")[1];
    if (typeof vol === "undefined") {
      Message.channel.send(
        `Current Volume: ${Message.guild.voiceConnection.dispatcher.volumeDecibels
          .toString()
          .substr(0, 5)}dB`
      );
    } else {
      if (Number(vol) > 50 || Number(vol) < -50) {
        Message.channel.send(
          `Can't really get any spicier... (Volume Cap is -50dB to 50dB)`
        );
        return;
      }
      try {
        Message.guild.voiceConnection.dispatcher.setVolumeDecibels(Number(vol));
        this.handleSuccess(Message);
      } catch (e) {
        this.handleError(e, Message);
      }
    }
  }
  handleSuccess(Message) {
    Message.channel.send(
      `Volume set to ${Message.guild.voiceConnection.dispatcher.volumeDecibels
        .toString()
        .substr(0, 5)}dB`
    );
  }
  handleError(Error, Message) {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.LOGGER.error(Error);
  }
}
exports.Volume = Volume;
