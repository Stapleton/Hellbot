"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lang = require("../lib/Lang");
const signale_1 = require("signale");
class Moderation {
    constructor() {
        Moderation.LOGGER.success(`${Lang.INIT_PLUGIN} ${Moderation.name}`);
    }
    static getInstance() {
        if (!Moderation.instance) {
            Moderation.instance = new Moderation();
        }
        return Moderation.instance;
    }
}
Moderation.LOGGER = new signale_1.Signale({
    scope: Moderation.name
});
exports.Moderation = Moderation;
//# sourceMappingURL=Moderation.js.map