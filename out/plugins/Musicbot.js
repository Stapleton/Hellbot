/** @format */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord_1 = require("../services/Discord");
const Lang = require("../lib/Lang");
const signale_1 = require("signale");
const Join_1 = require("./Musicbot/Join");
const Leave_1 = require("./Musicbot/Leave");
const Add_1 = require("./Musicbot/Add");
const Play_1 = require("./Musicbot/Play");
const Stop_1 = require("./Musicbot/Stop");
const Pause_1 = require("./Musicbot/Pause");
const Resume_1 = require("./Musicbot/Resume");
const Volume_1 = require("./Musicbot/Volume");
const Delete_1 = require("./Musicbot/Delete");
class Musicbot {
  constructor() {
    Musicbot.LOGGER.success(`${Lang.INIT_PLUGIN} ${Musicbot.name}`);
    let Discord = Discord_1.Discord.getInstance();
    Discord.on("message", MessageEvent => {
      let split = MessageEvent.content.split(" ");
      let args = { token: split[0], search: split[1] };
      switch (args.token) {
        case ".join":
          new Join_1.Join(MessageEvent);
          break;
        case ".leave":
          new Leave_1.Leave(MessageEvent);
          break;
        case ".add":
          new Add_1.Add(MessageEvent);
          break;
        case ".play":
          if (typeof args.search != "undefined") {
            new Add_1.Add(MessageEvent, false, true);
          } else {
            new Play_1.Play(MessageEvent);
          }
          break;
        case ".stop":
          new Stop_1.Stop(MessageEvent);
          break;
        case ".pause":
          new Pause_1.Pause(MessageEvent);
          break;
        case ".resume":
          new Resume_1.Resume(MessageEvent);
          break;
        case ".skip":
          new Stop_1.Stop(MessageEvent);
          new Play_1.Play(MessageEvent);
          break;
        case ".volume":
          new Volume_1.Volume(MessageEvent);
          break;
        case ".del":
          new Delete_1.Delete(MessageEvent);
          break;
      }
    });
  }
  static getInstance() {
    if (!Musicbot.instance) {
      Musicbot.instance = new Musicbot();
    }
    return Musicbot.instance;
  }
  static getLogger() {
    return Musicbot.LOGGER;
  }
}
Musicbot.LOGGER = new signale_1.Signale({ scope: Musicbot.name });
exports.Musicbot = Musicbot;
