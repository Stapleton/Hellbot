"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DJS = require("discord.js");
const Musicbot_1 = require("../Musicbot");
class Embed {
    constructor(Song, Message) {
        this.LOGGER = Musicbot_1.Musicbot.getLogger();
        let embed = new DJS.RichEmbed();
        embed.setAuthor(Message.client.user.username, Message.client.user.avatarURL);
        embed.setColor("RANDOM");
        embed.setURL(Song.URL);
        embed.setTitle(Song.Name);
        embed.setImage(Song.Thumbnail);
        embed.addField("Queue ID", Song.ID, true);
        embed.addField("Channel", Song.Channel, true);
        embed.addField("Length", Song.Length, true);
        embed.addField("Requested By", Song.RequestedBy, true);
        try {
            this.handleSuccess(embed, Message);
        }
        catch (error) {
            this.handleError(error, Message);
        }
    }
    handleSuccess(Embed, Message) {
        Message.channel.send(Embed);
    }
    handleError(Error, Message) {
        Message.channel.send(`Something went wrong. \`${Error.message}\``);
        this.LOGGER.error(Error);
    }
}
exports.Embed = Embed;
//# sourceMappingURL=Embed.js.map