/** @format */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Musicbot_1 = require("../Musicbot");
const Lib_1 = require("../../lib/Lib");
class Join {
  constructor(Message) {
    this.LOGGER = Musicbot_1.Musicbot.getLogger();
    if (Lib_1.Lib.checkForVC(Message) == false) return;
    if (Message.guild.voiceConnection) return;
    Message.guild
      .member(Message.author)
      .voiceChannel.join()
      .then(() => this.handleSuccess(Message))
      .catch(error => this.handleError(error, Message));
  }
  handleSuccess(Message) {
    Message.channel.send(`Connected`);
  }
  handleError(Error, Message) {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.LOGGER.error(Error);
  }
}
exports.Join = Join;
