import { Logger } from './Logger';
import * as DJS from 'discord.js';

class Discord extends DJS.Client {

  private Logger: Logger = new Logger('Discord');

  public static instance: Discord;
  
  public Guild: DJS.Guild;
  public Owner: DJS.User;

  constructor() {
    super();

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

  public GetGuild(GuildID: string): DJS.Guild {
    return this.guilds.get(GuildID);
  }

  public GetChannel(ChannelID: string): DJS.GuildChannel {
    return this.channels.get(ChannelID) as DJS.GuildChannel;
  }

  public GetUser(UserID: string): DJS.User {
    return this.users.get(UserID);
  }

  public GetRole(RoleID: string): DJS.Role {
    return this.Guild.roles.get(RoleID);
  }

  public SendDirectMessage(UserID: string, Message: any, Options?: DJS.MessageOptions): void {
    this.fetchUser(UserID).then(User => {
      User.createDM().then(Channel => {
        Channel.send(Message, Options);
      });
    }).catch(e => {
      this.Logger.error(e);
    });
  }

  public SendError(Error: any): void {
    this.SendDirectMessage(process.env.OWNERID, Error, { code: true });
  }

  public GetGuildRoles(): string[] {
    let Roles = [];
    this.Guild.roles.forEach(Role => {
      Roles.push(`**${Role.name}**: \`${Role.id}\``);
    });
    return Roles;
  }

  public ListGuildRoles(): void {
    this.SendDirectMessage(process.env.OWNERID, this.GetGuildRoles().join("\n"));
  }
}

export = Discord.instance;
