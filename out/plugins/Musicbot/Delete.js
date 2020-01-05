"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongoDB_1 = require("../../services/MongoDB");
const Musicbot_1 = require("../Musicbot");
const MongoDB = MongoDB_1.MongoDB.getInstance();
class Delete {
    constructor(Message) {
        this.LOGGER = Musicbot_1.Musicbot.getLogger();
        this.coll = MongoDB.getMusicbot();
        let id = Number(Message.content.split(' ')[1]);
        this.coll.deleteOne({ ID: id })
            .then(() => this.handleSuccess(id, Message))
            .catch(error => this.handleError(error, Message));
    }
    handleSuccess(SongID, Message) {
        Message.channel.send(`Removed song`);
    }
    handleError(Error, Message) {
        Message.channel.send(`Something went wrong. \`${Error.message}\``);
        this.LOGGER.error(Error);
    }
}
exports.Delete = Delete;
//# sourceMappingURL=Delete.js.map