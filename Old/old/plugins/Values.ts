import { default as Musicbot } from './musicbot';
import { default as Roleman } from './roleman';
import { Signale } from 'signale';
import * as DJS from 'discord.js';
import * as MDB from 'mongodb';

const MongoClient: Promise<MDB.MongoClient> = new MDB.MongoClient(process.env.MONGODB, { 
  authSource: "admin", 
  auth: { 
    user: process.env.MONGODB_USER, 
    password: process.env.MONGODB_PASS 
  }, 
  appname: "Alloybot", 
  useNewUrlParser: true,
  forceServerObjectId: true }).connect();
  
MongoClient.then(() => {
  console.log(`Connected to Database.`);
}).catch(e => {
  Values.SendError(`Values.ts:15 ${e}`);
});

const Discord: DJS.Client = new DJS.Client();
Discord.login(process.env.DISCORD);
Discord.on("ready", () => {
  console.log(`Connected to Discord.`);
});

Discord.on("error", e => {
  console.log(`Values.ts:27 ${e}`);
});

export default class Values {
  public static Discord: DJS.Client;
  public static OwnerID: string = process.env.OWNERID;
  public static Owner: DJS.User;
  public static GuildID: string = process.env.GUILDID;
  public static Guild: DJS.Guild;
  public static RoleChannelID: string = process.env.ROLEID;
  public static RoleChannel: DJS.TextChannel;
  public static MusicChannelID: string = process.env.MUSICID;
  public static MusicChannel: DJS.TextChannel;

  public static MongoClient: Promise<MDB.MongoClient>;
  public static Database: MDB.Db;

  public static Logger: Signale = new Signale();

  constructor() {
    Values.Discord = Discord;
    Values.MongoClient = MongoClient;

    MongoClient.then(MongoClient => {
      Values.Database = MongoClient.db("alloybot", { returnNonCachedInstance: true });
    }).catch(e => {
      Values.SendError(`Values.ts:49 ${e}`);
    });

    Discord.on("ready", () => {
      new Musicbot();
      
      new Roleman();
      Values.Owner = Discord.users.get(Values.OwnerID);
      Values.Guild = Discord.guilds.get(Values.GuildID);
      Values.RoleChannel = Values.Guild.channels.get(Values.RoleChannelID) as DJS.TextChannel;
      Values.MusicChannel = Values.Guild.channels.get(Values.MusicChannelID) as DJS.TextChannel;

      Values.RoleChannel.fetchMessages().catch(e => {
        Values.SendError(`Values.ts:64 ${e}`);
      });
      Values.MusicChannel.fetchMessages().catch(e => {
        Values.SendError(`Values.ts:67 ${e}`);
      });
    });
  }

  public static GetGuild(GuildID: string): DJS.Guild {
    return Values.Discord.guilds.get(GuildID);
  }

  public static GetChannel(ChannelID: string): DJS.GuildChannel {
    return Values.Discord.channels.get(ChannelID) as DJS.GuildChannel;
  }

  public static GetUser(UserID: string): DJS.User {
    return Values.Discord.users.get(UserID);
  }

  public static GetRole(RoleID: string): DJS.Role {
    return Values.Guild.roles.get(RoleID);
  }

  public static SendDirectMessage(UserID: string, Message: any, Options?: DJS.MessageOptions): void {
    Values.Discord.fetchUser(UserID).then(User => {
      User.createDM().then(Channel => {
        Channel.send(Message, Options).catch(e => {
          console.error(`Values.ts:92 ${e}`);
        });
      }).catch(e => {
        console.error(`Values.ts:91 ${e}`);
      });
    }).catch(e => {
      console.error(`Values.ts:90 ${e}`);
    });
  }

  public static SendError(Error: any): void {
    this.SendDirectMessage(Values.OwnerID, Error, { code: true });
  }

  public static ListGuildRoles(): void {
    this.SendDirectMessage(Values.OwnerID, this.GetGuildRoles().join("\n"));
  }

  public static GetGuildRoles(): string[] {
    let Roles = [];
    Values.Guild.roles.forEach(Role => {
      Roles.push(`"${Role.name}": \`${Role.id}\``);
    });
    return Roles;
  }

  public static GetMinutes(time: number): string {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }
}
