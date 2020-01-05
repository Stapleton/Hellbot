"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DJS = require("discord.js");
const signale_1 = require("signale");
const Lang = require("../lib/Lang");
class Discord extends DJS.Client {
    constructor() {
        super();
        this.login(process.env.DISCORD);
        this.on("ready", this.handleConnect);
        this.on("error", this.handleError);
    }
    handleConnect() {
        return Discord.LOGGER.success(`${Lang.INIT_SERVICE} ${Discord.name}`);
    }
    handleError(error) {
        return Discord.LOGGER.error(error);
    }
    static getInstance() {
        if (!Discord.instance) {
            Discord.instance = new Discord();
        }
        return Discord.instance;
    }
}
Discord.LOGGER = new signale_1.Signale({
    scope: "Discord"
});
exports.Discord = Discord;
//# sourceMappingURL=Discord.js.map