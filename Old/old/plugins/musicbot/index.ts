import { default as Values } from '../Values';
import ytdlrun = require('ytdl-run');
import * as DJS from 'discord.js';
import * as MDB from 'mongodb';

type SongID = string | number;

type Song =  {
  ID: SongID;
  URL: string;
  Search: string;
  RequestedBy: string;
  Length: string;
  Name: string;
  Thumbnail: string;
  Channel: string;
  Playing: boolean;
}

interface ParsedCommand {
  token: string;
  sub: string;
  args: string[];
}

class MBCommands {
  public static Collection: MDB.Collection;

  constructor() {
    Values.MongoClient.then(MongoClient => {
      MBCommands.Collection = MongoClient.db("alloybot", {returnNonCachedInstance: true}).collection("musicbot");
      MBCommands.Collection.updateMany({ Playing: true }, { $set: { Playing: false } }).catch(e => {
        Values.SendError(`Musicbot.ts:22 ${e}`);
      });
    }).catch(e => {
      Values.SendError(`Musicbot.ts:1 ${e}`);
    });
  }

  public static Join(Message: DJS.Message): void {
    let GuildMember = Values.Guild.fetchMember(Message.author.id);

    if (Values.Discord.user.client.voiceConnections.get(Values.GuildID)) {
      Message.channel.send(`Already connected!`);
      return;
    } else {
      GuildMember.then(Member => Member.voiceChannel.join());
      /*try {
        GuildMember.then(Member => Member.voiceChannel.join());
      } catch (e) {
        Values.SendError(`Musicbot.ts:26 ${e}`);
      }*/
    }
  }

  public static Leave(): void {
    let GuildMember = Values.Guild.fetchMember(Values.Discord.user.id);
    try {
      GuildMember.then(Member => Member.voiceChannel.leave());
    } catch (e) {
      Values.SendError(`Musicbot.ts:5 ${e}`);
    }
  }

  public static GetYoutube(Message: DJS.Message, Link: string): void {
    let Song: Song = {
      ID: Math.floor(Math.random() * 1000),
      URL: "",
      Search: Link,
      RequestedBy: Message.author.username,
      Length: "",
      Name: "",
      Thumbnail: "",
      Channel: "",
      Playing: false
    }

    let info = ytdlrun.getInfo(["--default-search", "ytsearch", Link]);
    Song.Length = Values.GetMinutes(info.duration);
    Song.Name = info.title;
    Song.Thumbnail = info.thumbnail;
    Song.Channel = info.uploader;
    Song.URL = info.webpage_url;
    this.AddSong(Song);
  }

  public static GetSpotify(SearchWords?: string[], Link?: string): void {

  }

  public static GetSouncloud(SearchWords?: string[], Link?: string): void {

  }

  public static Play(Message: DJS.Message): void {
    try {
      let GuildMember = Values.Guild.fetchMember(Values.Discord.user.id);
      let AuthorMember = Values.Guild.fetchMember(Message.author.id);
      let Songs = MBCommands.Collection.find({ Playing: false }).toArray();
      let Song, Songs2;

      Songs.then(s => {
        Songs2 = s;
        Song = s.shift();
      })
      let YTStream = ytdlrun.stream(["--default-search", "ytsearch", Song.Search]).stdout;
      let Connection;

      Promise.all([GuildMember, AuthorMember]).then(proms => {
        if (!proms[0].voiceChannel) {
          Connection = proms[1].voiceChannel.join();
        } else {
          Connection = proms[1].voiceChannel.connection;
        }
      });    

      MBCommands.Collection.findOneAndUpdate(Song, { $set: { Playing: true } });

      Connection.playStream(YTStream, { passes: 4, volume: Number("0.125"), bitrate: "auto" });

      Values.MusicChannel.send(MBCommands.SongEmbed(Song));

      Connection.dispatcher.on("end", () => {
          if (Songs2.length > 0) {
            MBCommands.DelSong(Song.ID, false);
            MBCommands.Play(Message);
          } else {
            Connection.disconnect();
            MBCommands.DelSong(Song.ID, false);
            Values.MusicChannel.send(`**End of Queue**`);
          }
      });
      MBCommands.Collection.findOneAndUpdate({ Playing: true }, { $set: { Playing: false } });
    } catch (e) {
      Values.SendError(`Musicbot.ts:12 ${e}`);
    }
  }

  public static Stop(): void {
    let GuildMember = Values.Guild.fetchMember(Values.Discord.user.id);
    
    GuildMember.then(Member => {
      Member.voiceChannel.connection.disconnect();
      MBCommands.Collection.findOneAndUpdate({ Playing: true }, { $set: { Playing: false } }).then(() => {
        Values.MusicChannel.send(`**Stopped**`);
      }).catch(e => {
        Values.SendError(`Musicbot.ts:15 ${e}`);
      });
    });    
  }

  public static Pause(): void {
    let GuildMember = Values.Guild.fetchMember(Values.Discord.user.id);
    
    GuildMember.then(Member => Member.voiceChannel.connection.dispatcher.pause());
  }

  public static Resume(): void {
    let GuildMember = Values.Guild.fetchMember(Values.Discord.user.id);
    
    GuildMember.then(Member => Member.voiceChannel.connection.dispatcher.resume());
  }

  public static SongEmbed(SongObj: Song): DJS.RichEmbed {
    let Embed = new DJS.RichEmbed();

    Embed.setAuthor(Values.Discord.user.username, Values.Discord.user.avatarURL);
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

  public static AddSong(Song: Song): void {
    MBCommands.Collection.insertOne(Song);
    Values.MusicChannel.send(MBCommands.SongEmbed(Song));
  }

  public static SkipSong(Message: DJS.Message): void {
    let GuildMember = Values.Guild.fetchMember(Values.Discord.user.id);

    GuildMember.then(Member => Member.voiceChannel.connection.dispatcher.end());

    MBCommands.Collection.deleteOne({ Playing: true }).then(() => {
      Values.MusicChannel.send(`**Skipped**`);
    }).catch(e => {
      Values.SendError(`Musicbot.ts:25 ${e}`);
    });
  }

  public static DelSong(SongID: SongID, SendMessage: boolean): void {
    MBCommands.Collection.deleteOne({ ID: Number(SongID) });

    if (SendMessage) Values.MusicChannel.send(`Removed Song #${SongID} from the queue.`);
  }

  public static Volume(Volume: string): void {
    let GuildMember = Values.Guild.fetchMember(Values.Discord.user.id);
    let Dispatcher;

    GuildMember.then(Member => Dispatcher = Member.voiceChannel.connection.dispatcher);

    if (Volume == "current") {
      Values.MusicChannel.send(`Current Volume: ${Dispatcher.volumeDecibels}dB`);
    } else {
      let VolumeInt = Number(Volume);

      if (VolumeInt > 100 || VolumeInt < -100) {
        Values.MusicChannel.send(`Can't really get any spicier... (Volume Cap is -100dB to 100dB)`);
        return;
      } else {
        Dispatcher.setVolumeDecibels(VolumeInt);
      }
    }
  }
}

export default class Musicbot {
  constructor() {
    new MBCommands();
    
    Values.Discord.on("message", Message => {
      let Parsed = Message.content.split(" ");

      let Command = {
        token: Parsed.shift().toLowerCase(),
        sub: Parsed.shift(),
        args: Parsed
      }

      if (Message.author.bot) return;
      
      if (Message.channel.id == Values.MusicChannelID) {
        this.Everyone(Message, Command);
      }

      if (Message.author.id == Values.OwnerID) {
        this.Moderation(Message, Command);
      }
    });
  }

  private Moderation(Message: DJS.Message, Command: ParsedCommand): void {
    
  }

  private Everyone(Message: DJS.Message, Command: ParsedCommand): void {
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
