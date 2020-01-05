"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Values_1 = require("./Values");
const ytdlrun = require("ytdl-run");
const DJS = require("discord.js");
class MBCommands {
    constructor() {
        Values_1.default.MongoClient.then(MongoClient => {
            MBCommands.Collection = MongoClient.db("224178589157818368", { returnNonCachedInstance: true }).collection("musicbot");
            MBCommands.Collection.updateMany({ Playing: true }, { $set: { Playing: false } }).catch(e => {
                Values_1.default.SendError(`Musicbot.ts:22 ${e}`);
            });
        }).catch(e => {
            Values_1.default.SendError(`Musicbot.ts:1 ${e}`);
        });
    }
    static async Join(Message) {
        let GuildMember = await Values_1.default.Guild.fetchMember(Message.author.id);
        if (Values_1.default.Discord.user.client.voiceConnections.get(Values_1.default.GuildID)) {
            Message.channel.send(`Already connected!`);
            return;
        }
        else {
            try {
                GuildMember.voiceChannel.join();
            }
            catch (e) {
                Values_1.default.SendError(`Musicbot.ts:26 ${e}`);
            }
        }
    }
    static async Leave() {
        let GuildMember = await Values_1.default.Guild.fetchMember(Values_1.default.Discord.user.id);
        try {
            GuildMember.voiceChannel.leave();
        }
        catch (e) {
            Values_1.default.SendError(`Musicbot.ts:5 ${e}`);
        }
    }
    static async GetYoutube(Message, Link) {
        let Song = {
            ID: Math.floor(Math.random() * 1000),
            URL: "",
            Search: Link,
            RequestedBy: Message.author.username,
            Length: "",
            Name: "",
            Thumbnail: "",
            Channel: "",
            Playing: false
        };
        let info = await ytdlrun.getInfo(["--default-search", "ytsearch", Link]);
        Song.Length = Values_1.default.GetMinutes(info.duration);
        Song.Name = info.title;
        Song.Thumbnail = info.thumbnail;
        Song.Channel = info.uploader;
        Song.URL = info.webpage_url;
        this.AddSong(Song);
    }
    static GetSpotify(SearchWords, Link) {
    }
    static GetSouncloud(SearchWords, Link) {
    }
    static async Play(Message) {
        try {
            let GuildMember = await Values_1.default.Guild.fetchMember(Values_1.default.Discord.user.id);
            let AuthorMember = await Values_1.default.Guild.fetchMember(Message.author.id);
            let Songs = await MBCommands.Collection.find({ Playing: false }).toArray();
            let Song = Songs.shift();
            let YTStream = ytdlrun.stream(["--default-search", "ytsearch", Song.Search]).stdout;
            let Connection;
            if (!GuildMember.voiceChannel) {
                Connection = await AuthorMember.voiceChannel.join();
            }
            else {
                Connection = AuthorMember.voiceChannel.connection;
            }
            MBCommands.Collection.findOneAndUpdate({ ID: Song.ID }, { $set: { Playing: true } });
            Connection.playStream(YTStream, { passes: 2, volume: 0.3, bitrate: "auto" });
            Values_1.default.MusicChannel.send(MBCommands.SongEmbed(Song));
            Connection.dispatcher.on("end", () => {
                if (Songs.length > 0) {
                    MBCommands.DelSong(Song.ID, false);
                    MBCommands.Play(Message);
                }
                else {
                    Connection.disconnect();
                    MBCommands.DelSong(Song.ID, false);
                    Values_1.default.MusicChannel.send(`**End of Queue**`);
                }
            });
        }
        catch (e) {
            Values_1.default.SendError(`Musicbot.ts:12 ${e}`);
        }
    }
    static async Stop() {
        let GuildMember = await Values_1.default.Guild.fetchMember(Values_1.default.Discord.user.id);
        GuildMember.voiceChannel.connection.disconnect();
        MBCommands.Collection.findOneAndUpdate({ Playing: true }, { $set: { Playing: false } }).then(() => {
            Values_1.default.MusicChannel.send(`**Stopped**`);
        }).catch(e => {
            Values_1.default.SendError(`Musicbot.ts:15 ${e}`);
        });
    }
    static async Pause() {
        let GuildMember = await Values_1.default.Guild.fetchMember(Values_1.default.Discord.user.id);
        GuildMember.voiceChannel.connection.dispatcher.pause();
    }
    static async Resume() {
        let GuildMember = await Values_1.default.Guild.fetchMember(Values_1.default.Discord.user.id);
        GuildMember.voiceChannel.connection.dispatcher.resume();
    }
    static SongEmbed(SongObj) {
        let Embed = new DJS.RichEmbed();
        Embed.setAuthor(Values_1.default.Discord.user.username, Values_1.default.Discord.user.avatarURL);
        Embed.setColor("RANDOM");
        Embed.setURL(SongObj.URL);
        Embed.setTitle(SongObj.Name);
        Embed.setImage(SongObj.Thumbnail);
        Embed.addField("Queue ID", SongObj.ID, true);
        Embed.addField("Channel", SongObj.Channel, true);
        Embed.addField("Length", SongObj.Length, true);
        Embed.addField("Requested By", SongObj.RequestedBy, true);
        return Embed;
    }
    static async AddSong(Song) {
        MBCommands.Collection.insertOne(Song);
        Values_1.default.MusicChannel.send(MBCommands.SongEmbed(Song));
    }
    static async SkipSong(Message) {
        let GuildMember = await Values_1.default.Guild.fetchMember(Values_1.default.Discord.user.id);
        GuildMember.voiceChannel.connection.dispatcher.end();
        await MBCommands.Collection.deleteOne({ Playing: true }).then(() => {
            Values_1.default.MusicChannel.send(`**Skipped**`);
        }).catch(e => {
            Values_1.default.SendError(`Musicbot.ts:25 ${e}`);
        });
    }
    static async DelSong(SongID, SendMessage) {
        await MBCommands.Collection.deleteOne({ ID: Number(SongID) });
        if (SendMessage)
            Values_1.default.MusicChannel.send(`Removed Song #${SongID} from the queue.`);
    }
    static async Volume(Volume) {
        let GuildMember = await Values_1.default.Guild.fetchMember(Values_1.default.Discord.user.id);
        let Dispatcher = GuildMember.voiceChannel.connection.dispatcher;
        if (Volume == "current") {
            Values_1.default.MusicChannel.send(`Current Volume: ${Dispatcher.volumeDecibels}dB`);
        }
        else {
            let VolumeInt = Number(Volume);
            if (VolumeInt > 50 || VolumeInt < -50) {
                Values_1.default.MusicChannel.send(`Can't really get any spicier... (Volume Cap is -50dB to 50dB)`);
                return;
            }
            else {
                Dispatcher.setVolumeDecibels(VolumeInt);
            }
        }
    }
}
class Musicbot {
    constructor() {
        new MBCommands();
        Values_1.default.Discord.on("message", Message => {
            let Parsed = Message.content.split(" ");
            let Command = {
                token: Parsed.shift().toLowerCase(),
                sub: Parsed.shift(),
                args: Parsed
            };
            if (Message.author.bot)
                return;
            if (Message.channel.id == Values_1.default.MusicChannelID) {
                this.Everyone(Message, Command);
            }
            if (Message.author.id == Values_1.default.OwnerID) {
                this.Moderation(Message, Command);
            }
        });
    }
    Moderation(Message, Command) {
    }
    Everyone(Message, Command) {
        if (Command.token.startsWith(">music")) {
            switch (Command.sub) {
                case "-j":
                case "-join":
                    MBCommands.Join(Message);
                    break;
                case "-l":
                case "-leave":
                    MBCommands.Leave();
                    break;
                case "-v":
                case "-volume":
                case "-vol":
                    MBCommands.Volume(Command.args[0]);
                    break;
                case "-a":
                case "-add":
                    MBCommands.GetYoutube(Message, Command.args.join(" "));
                    break;
                case "-p":
                case "-play":
                    MBCommands.Play(Message);
                    break;
                case "-P":
                case "-pause":
                    MBCommands.Pause();
                    break;
                case "-r":
                case "-resume":
                case "-continue":
                    MBCommands.Resume();
                    break;
                case "-s":
                case "-skip":
                    //MBCommands.SkipSong(Message);
                    break;
                case "-S":
                case "-stop":
                    MBCommands.Stop();
                    break;
                case "-d":
                case "-remove":
                case "-delete":
                case "-del":
                    MBCommands.DelSong(Command.args[0], true);
                    break;
            }
        }
    }
}
exports.default = Musicbot;
//# sourceMappingURL=Musicbot.js.map