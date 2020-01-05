"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Musicbot_1 = require("../Musicbot");
class Leave {
    constructor(Message) {
        this.LOGGER = Musicbot_1.Musicbot.getLogger();
        try {
            Message.client.voiceConnections.get(Message.guild.id).disconnect();
            //this.handleSuccess(Message);
        }
        catch (error) {
            this.handleError(error, Message);
        }
    }
    handleSuccess(Message) {
        Message.channel.send(`Disconnected`);
    }
    handleError(Error, Message) {
        Message.channel.send(`Something went wrong. \`${Error.message}\``);
        this.LOGGER.error(Error);
    }
}
exports.Leave = Leave;
//# sourceMappingURL=Leave.js.map