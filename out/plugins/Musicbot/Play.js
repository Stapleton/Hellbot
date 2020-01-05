"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ytdlrun = require("ytdl-run");
const Discord_1 = require("../../services/Discord");
const MongoDB_1 = require("../../services/MongoDB");
const Musicbot_1 = require("../Musicbot");
const Embed_1 = require("./Embed");
const MongoDB = MongoDB_1.MongoDB.getInstance();
const Discord = Discord_1.Discord.getInstance();
class Play {
    constructor(Message) {
        this.LOGGER = Musicbot_1.Musicbot.getLogger();
        this.coll = MongoDB.getMusicbot();
        this.coll.findOneAndDelete({ Playing: false })
            .then(result => this.handleSuccess(result, Message))
            .catch(error => this.handleError(error, Message));
    }
    handleSuccess(Result, Message) {
        if (Result.value == null) {
            Message.channel.send(`The queue is empty`);
            return;
        }
        //if (Result.value == null) Message.channel.send(`Something went wrong. \`Play.ts#handleSuccess // Result.value == null\``)
        //if (Result.ok != 1) Message.channel.send(`Something went wrong. \`Play.ts#handleSuccess // Result.ok != 1\``);
        const Stream = ytdlrun.stream(Result.value.URL).stdout;
        Message.guild.voiceConnection.playStream(Stream, { passes: 2, volume: 0.3, bitrate: "auto" });
        new Embed_1.Embed(Result.value, Message);
    }
    handleError(Error, Message) {
        Message.channel.send(`Something went wrong. \`${Error.message}\``);
        this.LOGGER.error(Error);
    }
}
exports.Play = Play;
//# sourceMappingURL=Play.js.map