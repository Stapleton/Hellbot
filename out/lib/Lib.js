/** @format */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord_1 = require("../services/Discord");
const signale_1 = require("signale");
const TestEmbed_1 = require("./TestEmbed");
const Lang = require("../lib/Lang");
class Lib {
  constructor() {
    Lib.LOGGER.success(`${Lang.INIT_PLUGIN} ${Lib.name}`);
    let Discord = Discord_1.Discord.getInstance();
    Discord.on("message", MessageEvent => {
      let token = MessageEvent.content.split(" ")[0];
      switch (token) {
        case ".testembed":
          new TestEmbed_1.TestEmbed(MessageEvent);
          break;
      }
    });
  }
  static getInstance() {
    if (!Lib.instance) {
      Lib.instance = new Lib();
    }
    return Lib.instance;
  }
  static getLogger() {
    return this.LOGGER;
  }
  static convertMin(time) {
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;
    var ret = "";
    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }
  static checkForVC(Message) {
    if (!Message.author.client.voiceConnections.has(Message.guild.id)) {
      Message.channel.send(
        `**Don't degrade the champion at any time!** A man in my position could never afford to look ridiculous. __You understand that?__ Tell Tito Santana and tell Hulk Hogan that.`
      );
      return false;
    }
  }
  static checkForPerms(Message, Permissions) {
    let bool = Message.member.hasPermission(Permissions, false, true, true);
    if (!bool) {
      Message.channel.send(
        `*licks beard with tongue* You're talkin to the Intercontinental Heavyweight Champion of the world! **Yeaaahhhhh** You can't beat the Macho Man Randy Cabbage, even Hulk Hogan. I'm watchin' you.`
      );
      return bool;
    }
  }
}
Lib.LOGGER = new signale_1.Signale({ scope: "Lib/Util" });
exports.Lib = Lib;
