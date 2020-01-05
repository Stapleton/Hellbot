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
        Discord.on('message', MessageEvent => {
            let token = MessageEvent.content.split(' ')[0];
            switch (token) {
                case '.testembed':
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
Lib.LOGGER = new signale_1.Signale({
    scope: "Lib/Util"
});
exports.Lib = Lib;
//# sourceMappingURL=Lib.js.map