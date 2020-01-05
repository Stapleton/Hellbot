"use strict";
const Logger_1 = require("./Logger");
const DJS = require("discord.js");
class Discord extends DJS.Client {
    constructor() {
        super();
        this.Logger = new Logger_1.Logger('Discord');
        this.login(process.env.DISCORD);
        this.on('ready', () => {
            this.Logger.success(`Connected to Discord.`);
            this.Guild = this.guilds.get(process.env.GUILDID);
            this.Owner = this.users.get(process.env.OWNERID);
            Discord.instance = new Discord();
        });
        this.on('error', e => {
            this.Logger.error(e);
        });
    }
    GetGuild(GuildID) {
        return this.guilds.get(GuildID);
    }
    GetChannel(ChannelID) {
        return this.channels.get(ChannelID);
    }
    GetUser(UserID) {
        return this.users.get(UserID);
    }
    GetRole(RoleID) {
        return this.Guild.roles.get(RoleID);
    }
    SendDirectMessage(UserID, Message, Options) {
        this.fetchUser(UserID).then(User => {
            User.createDM().then(Channel => {
                Channel.send(Message, Options);
            });
        }).catch(e => {
            this.Logger.error(e);
        });
    }
    SendError(Error) {
        this.SendDirectMessage(process.env.OWNERID, Error, { code: true });
    }
    GetGuildRoles() {
        let Roles = [];
        this.Guild.roles.forEach(Role => {
            Roles.push(`**${Role.name}**: \`${Role.id}\``);
        });
        return Roles;
    }
    ListGuildRoles() {
        this.SendDirectMessage(process.env.OWNERID, this.GetGuildRoles().join("\n"));
    }
}
module.exports = Discord.instance;
//# sourceMappingURL=Discord.js.map