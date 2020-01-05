import { default as Values } from '../Values';
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
      RMCommands.Collection = MongoClient.db("alloybot", {returnNonCachedInstance: true}).collection("roleman");
    }).catch(e => {
      Values.SendError(`Roleman.ts:15 ${e}`);
    });
  }

  public static AddGuildRole(Role: DJS.Role, Emoji: string): void {
    let RoleDoc = {
      EmojiID: DJS.Util.parseEmoji(Emoji).name,
      RoleID: Role.id,
      GuildID: Values.GuildID
    }

    let DocFilter = {
      RoleID: Role.id
    }

    RMCommands.Collection.countDocuments(DocFilter, (e, Count) => {
      if (Error) Values.SendError(`Roleman.ts:33 ${e}`);
      if (Count > 0) {
        RMCommands.Collection.findOneAndUpdate(DocFilter, RoleDoc).catch(e => {
          Values.SendError(`Roleman.ts:36 ${e}`);
        });
      } else {
        RMCommands.Collection.insertOne(RoleDoc, { forceServerObjectId: true }, (e) => {
          if (Error) Values.SendError(`Roleman.ts:40 ${e}`);
          else Values.RoleChannel.send(`Associated Role '${Role.name}' to the emoji ${Emoji}`);
        });
      }
    });
  }
  
  public static AddUserRole(Reaction: DJS.MessageReaction, User: DJS.User): void {
    if (User.id == Values.Discord.user.id) return;

    let DocFilter = {
      EmojiID: Reaction.emoji.name
    }

    RMCommands.Collection.findOne(DocFilter, (e, Doc) => {
      //if (Error) Values.SendError(e);
      let Role = Values.GetRole(Doc.RoleID);
      Values.Guild.fetchMember(User).then(Member => {
        Member.addRole(Role);
      }).catch(e => {
        //Values.SendError(e);
      });
    })
  }

  public static DelGuildRole(Role: DJS.Role): void {
    let DocFilter = {
      RoleID: Role.id
    }

    RMCommands.Collection.findOneAndDelete(DocFilter, (e) => {
      if (Error) Values.SendError(e);
      else Values.RoleChannel.send(`Disassociated Role '${Role.name}'`).catch(e => {
        Values.SendError(e);
      });
    });
  }

  public static DelUserRole(Reaction: DJS.MessageReaction, User: DJS.User): void {
    if (User.id == Values.Discord.user.id) return;

    let DocFilter = {
      EmojiID: Reaction.emoji.name
    }

    RMCommands.Collection.findOne(DocFilter, (e, Doc) => {
      //if (Error) Values.SendError(e);
      let Role = Values.GetRole(Doc.RoleID);
      Values.Guild.fetchMember(User).then(Member => {
        Member.removeRole(Role);
      }).catch(e => {
        //Values.SendError(e);
      });
    })
  }

  public static InitialMessage(): void {
    let DocFilter = {
      GuildID: Values.GuildID
    }
    let RoleStrings = [];

    RMCommands.Collection.find(DocFilter).toArray().then(Docs => {
      Docs.forEach(Doc => {
        RoleStrings.unshift({ msg: `React below to get the **"${Values.GetRole(Doc.RoleID).name}"** role!`, emoji: Doc.EmojiID });
      });
    }).catch(e => {
      if (e) Values.SendError(e);
    }).finally(() => {
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
