"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const musicbot_1 = require("./musicbot");
const roleman_1 = require("./roleman");
const signale_1 = require("signale");
const DJS = require("discord.js");
const MDB = require("mongodb");
const MongoClient = new MDB.MongoClient(process.env.MONGODB, {
    authSource: "admin",
    auth: {
        user: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASS
    },
    appname: "Alloybot",
    useNewUrlParser: true,
    forceServerObjectId: true
}).connect();
MongoClient.then(() => {
    console.log(`Connected to Database.`);
}).catch(e => {
    Values.SendError(`Values.ts:15 ${e}`);
});
const Discord = new DJS.Client();
Discord.login(process.env.DISCORD);
Discord.on("ready", () => {
    console.log(`Connected to Discord.`);
});
Discord.on("error", e => {
    console.log(`Values.ts:27 ${e}`);
});
class Values {
    constructor() {
        Values.Discord = Discord;
        Values.MongoClient = MongoClient;
        MongoClient.then(MongoClient => {
            Values.Database = MongoClient.db("alloybot", { returnNonCachedInstance: true });
        }).catch(e => {
            Values.SendError(`Values.ts:49 ${e}`);
        });
        Discord.on("ready", () => {
            new musicbot_1.default();
            new roleman_1.default();
            Values.Owner = Discord.users.get(Values.OwnerID);
            Values.Guild = Discord.guilds.get(Values.GuildID);
            Values.RoleChannel = Values.Guild.channels.get(Values.RoleChannelID);
            Values.MusicChannel = Values.Guild.channels.get(Values.MusicChannelID);
            Values.RoleChannel.fetchMessages().catch(e => {
                Values.SendError(`Values.ts:64 ${e}`);
            });
            Values.MusicChannel.fetchMessages().catch(e => {
                Values.SendError(`Values.ts:67 ${e}`);
            });
        });
    }
    static GetGuild(GuildID) {
        return Values.Discord.guilds.get(GuildID);
    }
    static GetChannel(ChannelID) {
        return Values.Discord.channels.get(ChannelID);
    }
    static GetUser(UserID) {
        return Values.Discord.users.get(UserID);
    }
    static GetRole(RoleID) {
        return Values.Guild.roles.get(RoleID);
    }
    static SendDirectMessage(UserID, Message, Options) {
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
    static SendError(Error) {
        this.SendDirectMessage(Values.OwnerID, Error, { code: true });
    }
    static ListGuildRoles() {
        this.SendDirectMessage(Values.OwnerID, this.GetGuildRoles().join("\n"));
    }
    static GetGuildRoles() {
        let Roles = [];
        Values.Guild.roles.forEach(Role => {
            Roles.push(`"${Role.name}": \`${Role.id}\``);
        });
        return Roles;
    }
    static GetMinutes(time) {
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
Values.OwnerID = process.env.OWNERID;
Values.GuildID = process.env.GUILDID;
Values.RoleChannelID = process.env.ROLEID;
Values.MusicChannelID = process.env.MUSICID;
Values.Logger = new signale_1.Signale();
exports.default = Values;
//# sourceMappingURL=Values.js.map