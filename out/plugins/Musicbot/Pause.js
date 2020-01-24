/** @format */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Musicbot_1 = require("../Musicbot");
const Lib_1 = require("../../lib/Lib");
class Pause {
  constructor(Message) {
    this.LOGGER = Musicbot_1.Musicbot.getLogger();
    if (Lib_1.Lib.checkForVC(Message) == false) return;
    try {
      Message.guild.voiceConnection.dispatcher.pause();
      this.handleSuccess(Message);
    } catch (e) {
      this.handleError(e, Message);
    }
  }
  handleSuccess(Message) {
    Message.channel.send(`Paused`);
  }
  handleError(Error, Message) {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.LOGGER.error(Error);
  }
}
exports.Pause = Pause;
