/** @format */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord_1 = require("../services/Discord");
const Lang = require("../lib/Lang");
const signale_1 = require("signale");
const Link_1 = require("./RoleManager/Link");
class RoleManager {
  constructor() {
    RoleManager.LOGGER.success(`${Lang.INIT_PLUGIN} ${RoleManager.name}`);
    let Discord = Discord_1.Discord.getInstance();
    Discord.on("message", MessageEvent => {
      let token = MessageEvent.content.split(" ")[0];
      switch (token) {
        case ".link":
          new Link_1.Link(MessageEvent);
          break;
      }
    });
  }
  static getInstance() {
    if (!RoleManager.instance) {
      RoleManager.instance = new RoleManager();
    }
    return RoleManager.instance;
  }
  static getLogger() {
    return RoleManager.LOGGER;
  }
}
RoleManager.LOGGER = new signale_1.Signale({ scope: RoleManager.name });
exports.RoleManager = RoleManager;
