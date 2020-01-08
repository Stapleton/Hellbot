import { Discord as DiscordService } from '../services/Discord';
import { MongoDB as MongoDBService } from '../services/MongoDB';
import { Signale } from 'signale';
import { TestEmbed } from './TestEmbed';
import * as DJS from 'discord.js';
import * as MDB from 'mongodb';
import * as Lang from '../lib/Lang';

export class Lib {
  private static instance: Lib;

  protected static LOGGER = new Signale({
    scope: "Lib/Util"
  });

  // this is a singleton class
  private constructor() {
    Lib.LOGGER.success(`${Lang.INIT_PLUGIN} ${Lib.name}`);

    let Discord = DiscordService.getInstance();

    Discord.on('message', MessageEvent => {
      let token = MessageEvent.content.split(' ')[0];

      switch (token) {
        case '.testembed':
          new TestEmbed(MessageEvent);
          break;
      }
    });
  }

  public static getInstance(): Lib {
    if (!Lib.instance) {
      Lib.instance = new Lib();
    }

    return Lib.instance;
  }

  public static getLogger(): Signale {
    return this.LOGGER;
  }

  // Because I am too lazy to figure out the i18n node lib
  public static convertMin(time: number): string {
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

  // Quick util for checking if a user is connected to a voice channel in the same guild as the bot or not
  public static checkForVC(Message: DJS.Message): boolean {
    if (!Message.author.client.voiceConnections.has(Message.guild.id)) {
      Message.channel.send(`**Don't degrade the champion at any time!** A man in my position could never afford to look ridiculous. __You understand that?__ Tell Tito Santana and tell Hulk Hogan that.`);
      return false;
    }
  }

  public static checkForPerms(Message: DJS.Message, Permissions: DJS.PermissionResolvable): boolean {
    let bool = Message.member.hasPermission(Permissions, false, true, true);
    if (!bool) {
      Message.channel.send(`*licks beard with tongue* You're talkin to the Intercontinental Heavyweight Champion of the world! **Yeaaahhhhh** You can't beat the Macho Man Randy Cabbage, even Hulk Hogan. I'm watchin' you.`);
      return bool;
    }
  }
}
