"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Musicbot_1 = require("../Musicbot");
class Resume {
    constructor(Message) {
        this.LOGGER = Musicbot_1.Musicbot.getLogger();
        try {
            Message.guild.voiceConnection.dispatcher.resume();
            this.handleSuccess(Message);
        }
        catch (e) {
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
exports.Resume = Resume;
//# sourceMappingURL=Resume.js.map