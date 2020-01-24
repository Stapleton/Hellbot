/** @format */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ytdlrun = require("ytdl-run");
const MongoDB_1 = require("../../services/MongoDB");
const Musicbot_1 = require("../Musicbot");
const Embed_1 = require("./Embed");
const Join_1 = require("./Join");
const Lib_1 = require("../../lib/Lib");
const MongoDB = MongoDB_1.MongoDB.getInstance();
class Play {
  constructor(Message) {
    this.LOGGER = Musicbot_1.Musicbot.getLogger();
    if (Lib_1.Lib.checkForVC(Message) == false) return;
    this.coll = MongoDB.getCollection(
      Message.guild.id,
      MongoDB_1.COLLECTIONS.Musicbot
    );
    if (!Message.guild.voiceConnection) new Join_1.Join(Message);
    this.coll
      .findOneAndDelete({ Playing: false })
      .then(result => this.handleSuccess(result, Message))
      .catch(error => this.handleError(error, Message));
  }
  handleSuccess(Result, Message) {
    if (Result.value == null) {
      Message.channel.send(`End of Queue`);
      return;
    }
    const Stream = ytdlrun.stream(Result.value.URL).stdout;
    Message.guild.voiceConnection.playStream(Stream, {
      passes: 1,
      volume: 0.3,
      bitrate: "auto",
    });
    Message.guild.voiceConnection.dispatcher.once("end", () => {
      new Play(Message);
    });
    new Embed_1.SongEmbed(Message, Result.value, "Playing");
  }
  handleError(Error, Message) {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.LOGGER.error(Error);
  }
}
exports.Play = Play;
