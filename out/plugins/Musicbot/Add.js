"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ytdlrun = require("ytdl-run");
const MongoDB_1 = require("../../services/MongoDB");
const Musicbot_1 = require("../Musicbot");
const Lib_1 = require("../../lib/Lib");
const Embed_1 = require("./Embed");
const Play_1 = require("./Play");
const MongoDB = MongoDB_1.MongoDB.getInstance();
class Add {
    constructor(Message, embed = true, play = false) {
        this.LOGGER = Musicbot_1.Musicbot.getLogger();
        this.coll = MongoDB.getMusicbot();
        this.Song = {
            ID: 13378675309,
            URL: "https://www.youtube.com/watch?v=QsC6pfLisU4",
            Search: "You didn't search anything.",
            RequestedBy: "Whoever ran the command.",
            Length: "69:42:00",
            Name: "Is the safe done?",
            Thumbnail: "https://cdn.discordapp.com/attachments/595858296385175552/653684368354705408/circle_game-1.jpg",
            Channel: ":Pog:",
            Playing: false
        };
        //this.LOGGER.debug(`Got Song`);
        this.Song.RequestedBy = Message.author.username;
        let search = Message.content.split(' ')[1];
        if (typeof search === 'undefined') {
            this.addSong(Message, embed, play);
        }
        else {
            this.Song.Search = Message.content.split(' ').slice(1).join(' ');
            ytdlrun.getInfo(["--default-search", "ytsearch", this.Song.Search])
                .then(info => this.handleSuccess(info, Message, embed, play))
                .catch(error => this.handleError(error, Message));
        }
        //Message.channel.send(`\`\`\`json\n${JSON.stringify(this.Song)}\`\`\``);
    }
    handleSuccess(Info, Message, embed, play) {
        this.Song.Length = Lib_1.Lib.convertMin(Info.duration);
        this.Song.Name = Info.title;
        this.Song.Thumbnail = Info.thumbnail;
        this.Song.Channel = Info.uploader;
        this.Song.URL = Info.webpage_url;
        this.addSong(Message, embed, play);
    }
    handleError(Error, Message) {
        Message.channel.send(`Something went wrong. \`${Error.message}\``);
        this.LOGGER.error(Error);
    }
    addSong(Message, embed, play) {
        this.Song.ID = Math.floor(Math.random() * 1000);
        this.coll.insertOne(this.Song);
        //this.LOGGER.debug(`Added Song`);
        if (embed)
            new Embed_1.Embed(this.Song, Message);
        if (play)
            new Play_1.Play(Message);
    }
}
exports.Add = Add;
//# sourceMappingURL=Add.js.map