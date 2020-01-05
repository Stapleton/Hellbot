"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Values_1 = require("../Values");
const ytdlrun = require("ytdl-run");
const DJS = require("discord.js");
class MBCommands {
    constructor() {
        Values_1.default.MongoClient.then(MongoClient => {
            MBCommands.Collection = MongoClient.db("alloybot", { returnNonCachedInstance: true }).collection("musicbot");
            MBCommands.Collection.updateMany({ Playing: true }, { $set: { Playing: false } }).catch(e => {
                Values_1.default.SendError(`Musicbot.ts:22 ${e}`);
            });
        }).catch(e => {
            Values_1.default.SendError(`Musicbot.ts:1 ${e}`);
        });
    }
    static Join(Message) {
        let GuildMember = Values_1.default.Guild.fetchMember(Message.author.id);
        if (Values_1.default.Discord.user.client.voiceConnections.get(Values_1.default.GuildID)) {
            Message.channel.send(`Already connected!`);
            return;
        }
        else {
            GuildMember.then(Member => Member.voiceChannel.join());
            /*try {
              GuildMember.then(Member => Member.voiceChannel.join());
            } catch (e) {
              Values.SendError(`Musicbot.ts:26 ${e}`);
            }*/
        }
    }
    static Leave() {
        let GuildMember = Values_1.default.Guild.fetchMember(Values_1.default.Discord.user.id);
        try {
            GuildMember.then(Member => Member.voiceChannel.leave());
        }
        catch (e) {
            Values_1.default.SendError(`Musicbot.ts:5 ${e}`);
        }
    }
    static GetYoutube(Message, Link) {
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
        let info = ytdlrun.getInfo(["--default-search", "ytsearch", Link]);
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
    static Play(Message) {
        try {
            let GuildMember = Values_1.default.Guild.fetchMember(Values_1.default.Discord.user.id);
            let AuthorMember = Values_1.default.Guild.fetchMember(Message.author.id);
            let Songs = MBCommands.Collection.find({ Playing: false }).toArray();
            let Song, Songs2;
            Songs.then(s => {
                Songs2 = s;
                Song = s.shift();
            });
            let YTStream = ytdlrun.stream(["--default-search", "ytsearch", Song.Search]).stdout;
            let Connection;
            Promise.all([GuildMember, AuthorMember]).then(proms => {
                if (!proms[0].voiceChannel) {
                    Connection = proms[1].voiceChannel.join();
                }
                else {
                    Connection = proms[1].voiceChannel.connection;
                }
            });
            MBCommands.Collection.findOneAndUpdate(Song, { $set: { Playing: true } });
            Connection.playStream(YTStream, { passes: 4, volume: Number("0.125"), bitrate: "auto" });
            Values_1.default.MusicChannel.send(MBCommands.SongEmbed(Song));
            Connection.dispatcher.on("end", () => {
                if (Songs2.length > 0) {
                    MBCommands.DelSong(Song.ID, false);
                    MBCommands.Play(Message);
                }
                else {
                    Connection.disconnect();
                    MBCommands.DelSong(Song.ID, false);
                    Values_1.default.MusicChannel.send(`**End of Queue**`);
                }
            });
            MBCommands.Collection.findOneAndUpdate({ Playing: true }, { $set: { Playing: false } });
        }
        catch (e) {
            Values_1.default.SendError(`Musicbot.ts:12 ${e}`);
        }
    }
    static Stop() {
        let GuildMember = Values_1.default.Guild.fetchMember(Values_1.default.Discord.user.id);
        GuildMember.then(Member => {
            Member.voiceChannel.connection.disconnect();
            MBCommands.Collection.findOneAndUpdate({ Playing: true }, { $set: { Playing: false } }).then(() => {
                Values_1.default.MusicChannel.send(`**Stopped**`);
            }).catch(e => {
                Values_1.default.SendError(`Musicbot.ts:15 ${e}`);
            });
        });
    }
    static Pause() {
        let GuildMember = Values_1.default.Guild.fetchMember(Values_1.default.Discord.user.id);
        GuildMember.then(Member => Member.voiceChannel.connection.dispatcher.pause());
    }
    static Resume() {
        let GuildMember = Values_1.default.Guild.fetchMember(Values_1.default.Discord.user.id);
        GuildMember.then(Member => Member.voiceChannel.connection.dispatcher.resume());
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
    static AddSong(Song) {
        MBCommands.Collection.insertOne(Song);
        Values_1.default.MusicChannel.send(MBCommands.SongEmbed(Song));
    }
    static SkipSong(Message) {
        let GuildMember = Values_1.default.Guild.fetchMember(Values_1.default.Discord.user.id);
        GuildMember.then(Member => Member.voiceChannel.connection.dispatcher.end());
        MBCommands.Collection.deleteOne({ Playing: true }).then(() => {
            Values_1.default.MusicChannel.send(`**Skipped**`);
        }).catch(e => {
            Values_1.default.SendError(`Musicbot.ts:25 ${e}`);
        });
    }
    static DelSong(SongID, SendMessage) {
        MBCommands.Collection.deleteOne({ ID: Number(SongID) });
        if (SendMessage)
            Values_1.default.MusicChannel.send(`Removed Song #${SongID} from the queue.`);
    }
    static Volume(Volume) {
        let GuildMember = Values_1.default.Guild.fetchMember(Values_1.default.Discord.user.id);
        let Dispatcher;
        GuildMember.then(Member => Dispatcher = Member.voiceChannel.connection.dispatcher);
        if (Volume == "current") {
            Values_1.default.MusicChannel.send(`Current Volume: ${Dispatcher.volumeDecibels}dB`);
        }
        else {
            let VolumeInt = Number(Volume);
            if (VolumeInt > 100 || VolumeInt < -100) {
                Values_1.default.MusicChannel.send(`Can't really get any spicier... (Volume Cap is -100dB to 100dB)`);
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
                    MBCommands.SkipSong(Message);
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
//# sourceMappingURL=index.js.map