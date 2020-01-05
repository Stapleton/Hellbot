"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Values_1 = require("./Values");
const DJS = require("discord.js");
class RMCommands {
    constructor() {
        Values_1.default.MongoClient.then(MongoClient => {
            RMCommands.Collection = MongoClient.db("224178589157818368", { returnNonCachedInstance: true }).collection("roleman");
        }).catch(e => {
            Values_1.default.SendError(`Roleman.ts:15 ${e}`);
        });
    }
    static async AddGuildRole(Role, Emoji) {
        let RoleDoc = {
            EmojiID: DJS.Util.parseEmoji(Emoji).name,
            RoleID: Role.id,
            GuildID: Values_1.default.GuildID
        };
        let DocFilter = {
            RoleID: Role.id
        };
        //let DocumentCount = await RMCommands.Collection.countDocuments(DocFilter);
        RMCommands.Collection.insertOne(RoleDoc).catch(e => {
            Values_1.default.SendError(`Roleman.ts:35 ${e}`);
        });
        Values_1.default.RoleChannel.send(`Associated Role '${Role.name}' to the emoji ${Emoji}`);
    }
    static async AddUserRole(Reaction, User) {
        if (User.id == Values_1.default.Discord.user.id)
            return;
        let DocFilter = {
            EmojiID: Reaction.emoji.name
        };
        let Doc = await RMCommands.Collection.findOne(DocFilter);
        let GuildMember = await Values_1.default.Guild.fetchMember(User);
        let Role = Values_1.default.GetRole(Doc.RoleID);
        GuildMember.addRole(Role);
    }
    static async DelGuildRole(Role) {
        let DocFilter = {
            RoleID: Role.id
        };
        RMCommands.Collection.findOneAndDelete(DocFilter).catch(e => {
            Values_1.default.SendError(`Roleman.ts:62 ${e}`);
        });
        Values_1.default.RoleChannel.send(`Disassociated Role '${Role.name}'`);
    }
    static async DelUserRole(Reaction, User) {
        if (User.id == Values_1.default.Discord.user.id)
            return;
        let DocFilter = {
            EmojiID: Reaction.emoji.name
        };
        let Doc = await RMCommands.Collection.findOne(DocFilter);
        let GuildMember = await Values_1.default.Guild.fetchMember(User);
        let Role = Values_1.default.GetRole(Doc.RoleID);
        GuildMember.removeRole(Role);
    }
    static async InitialMessage() {
        let DocFilter = {
            GuildID: Values_1.default.GuildID
        };
        let RoleStrings = [];
        let RoleArray = await RMCommands.Collection.find(DocFilter).toArray();
        RoleArray.forEach(Doc => {
            RoleStrings.unshift({ msg: `React below to get the **"${Values_1.default.GetRole(Doc.RoleID).name}"** role!`, emoji: Doc.EmojiID });
        });
        RoleStrings.forEach(RoleString => {
            Values_1.default.RoleChannel.send(RoleString.msg).then((msg) => {
                let sent = msg;
                sent.react(RoleString.emoji).catch(e => {
                    Values_1.default.SendError(e);
                });
            }).catch(e => {
                Values_1.default.SendError(e);
            });
        });
    }
}
class Roleman {
    constructor() {
        new RMCommands();
        Values_1.default.Discord.on("message", Message => {
            let Parsed = Message.content.toLowerCase().split(" ");
            let Command = {
                token: Parsed.shift(),
                sub: Parsed.shift(),
                args: Parsed
            };
            if (Message.author.bot)
                return;
            if (Message.channel.id == Values_1.default.RoleChannelID) {
                if (Message.author.id == Values_1.default.OwnerID)
                    this.Moderation(Command);
                else
                    this.Everyone(Message, Command);
            }
            if (Message.channel.id == Values_1.default.OwnerID) {
                this.Moderation(Command);
            }
        });
        Values_1.default.Discord.on("messageReactionAdd", (Reaction, User) => {
            RMCommands.AddUserRole(Reaction, User);
        });
        Values_1.default.Discord.on("messageReactionRemove", (Reaction, User) => {
            RMCommands.DelUserRole(Reaction, User);
        });
    }
    Moderation(Command) {
        if (Command.token == ">role") {
            switch (Command.sub) {
                case "-a":
                case "-add":
                    RMCommands.AddGuildRole(Values_1.default.GetRole(Command.args[0]), Command.args[1]);
                    break;
                case "-d":
                case "-del":
                    RMCommands.DelGuildRole(Values_1.default.GetRole(Command.args[0]));
                    break;
                case "-l":
                case "-ls":
                case "-list":
                    Values_1.default.ListGuildRoles();
                    break;
                case "-i":
                case "-init":
                    RMCommands.InitialMessage();
                    break;
            }
        }
    }
    Everyone(Message, Command) {
    }
}
exports.default = Roleman;
//# sourceMappingURL=Roleman.js.map