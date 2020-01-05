import { default as Values } from './Values';
import * as DJS from 'discord.js';
import * as MDB from 'mongodb';

interface ParsedCommand {
  token: string;
  sub: string;
  args: string[];
}

class RMCommands {
  public static Collection: MDB.Collection;

  constructor() {
    Values.MongoClient.then(MongoClient => {
      RMCommands.Collection = MongoClient.db("224178589157818368", {returnNonCachedInstance: true}).collection("roleman");
    }).catch(e => {
      Values.SendError(`Roleman.ts:15 ${e}`);
    });
  }

  public static async AddGuildRole(Role: DJS.Role, Emoji: string): Promise<any> {
    let RoleDoc = {
      EmojiID: DJS.Util.parseEmoji(Emoji).name,
      RoleID: Role.id,
      GuildID: Values.GuildID
    }

    let DocFilter = {
      RoleID: Role.id
    }

    //let DocumentCount = await RMCommands.Collection.countDocuments(DocFilter);
    
    RMCommands.Collection.insertOne(RoleDoc).catch(e => {
      Values.SendError(`Roleman.ts:35 ${e}`);
    });
    Values.RoleChannel.send(`Associated Role '${Role.name}' to the emoji ${Emoji}`);
  }
  
  public static async AddUserRole(Reaction: DJS.MessageReaction, User: DJS.User): Promise<any> {
    if (User.id == Values.Discord.user.id) return;

    let DocFilter = {
      EmojiID: Reaction.emoji.name
    }

    let Doc = await RMCommands.Collection.findOne(DocFilter);
    let GuildMember = await Values.Guild.fetchMember(User);
    let Role = Values.GetRole(Doc.RoleID);

    GuildMember.addRole(Role);
  }

  public static async DelGuildRole(Role: DJS.Role): Promise<any> {
    let DocFilter = {
      RoleID: Role.id
    }



    RMCommands.Collection.findOneAndDelete(DocFilter).catch(e => {
      Values.SendError(`Roleman.ts:62 ${e}`);
    });
    Values.RoleChannel.send(`Disassociated Role '${Role.name}'`);
  }

  public static async DelUserRole(Reaction: DJS.MessageReaction, User: DJS.User): Promise<any> {
    if (User.id == Values.Discord.user.id) return;

    let DocFilter = {
      EmojiID: Reaction.emoji.name
    }

    let Doc = await RMCommands.Collection.findOne(DocFilter);
    let GuildMember = await Values.Guild.fetchMember(User);
    let Role = Values.GetRole(Doc.RoleID);

    GuildMember.removeRole(Role);
  }

  public static async InitialMessage(): Promise<any> {
    let DocFilter = {
      GuildID: Values.GuildID
    }

    let RoleStrings = [];

    let RoleArray = await RMCommands.Collection.find(DocFilter).toArray();
    RoleArray.forEach(Doc => {
      RoleStrings.unshift({ msg: `React below to get the **"${Values.GetRole(Doc.RoleID).name}"** role!`, emoji: Doc.EmojiID });
    });
    RoleStrings.forEach(RoleString => {
      Values.RoleChannel.send(RoleString.msg).then((msg) => {
        let sent = <DJS.Message>msg;
        sent.react(RoleString.emoji).catch(e => {
          Values.SendError(e);
        });
      }).catch(e => {
        Values.SendError(e);
      });
    });
  }
}

export default class Roleman {
  constructor() {
    new RMCommands();

    Values.Discord.on("message", Message => {
      let Parsed = Message.content.toLowerCase().split(" ");

      let Command = {
        token: Parsed.shift(),
        sub: Parsed.shift(),
        args: Parsed
      }

      if (Message.author.bot) return;

      if (Message.channel.id == Values.RoleChannelID) {
        if (Message.author.id == Values.OwnerID) this.Moderation(Command);
        else this.Everyone(Message, Command);
      }

      if (Message.channel.id == Values.OwnerID) {
        this.Moderation(Command);
      }
    });

    Values.Discord.on("messageReactionAdd", (Reaction, User) => {
      RMCommands.AddUserRole(Reaction, User);
    });
    Values.Discord.on("messageReactionRemove", (Reaction, User) => {
      RMCommands.DelUserRole(Reaction, User)
    });
  }

  private Moderation(Command: ParsedCommand): void {
    if (Command.token == ">role") {
      switch (Command.sub) {
        case "-a":
        case "-add": 
          RMCommands.AddGuildRole(Values.GetRole(Command.args[0]), Command.args[1]);
          break;

        case "-d":
        case "-del":
          RMCommands.DelGuildRole(Values.GetRole(Command.args[0]));
          break;
        
        case "-l":
        case "-ls":
        case "-list":
          Values.ListGuildRoles();
          break;

        case "-i":
        case "-init":
          RMCommands.InitialMessage();
          break;
      }
    }
  }

  private Everyone(Message: DJS.Message, Command: ParsedCommand): void {

  }
}
