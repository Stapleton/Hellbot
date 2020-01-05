"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Musicbot_1 = require("../Musicbot");
class Stop {
    constructor(Message) {
        this.LOGGER = Musicbot_1.Musicbot.getLogger();
        try {
            Message.guild.voiceConnection.dispatcher.end();
            this.handleSuccess(Message);
        }
        catch (e) {
            this.handleError(e, Message);
        }
    }
    handleSuccess(Message) {
        Message.channel.send(`Stopped`);
    }
    handleError(Error, Message) {
        Message.channel.send(`Something went wrong. \`${Error.message}\``);
        this.LOGGER.error(Error);
    }
}
exports.Stop = Stop;
//# sourceMappingURL=Stop.js.map