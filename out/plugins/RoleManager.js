"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lang = require("../lib/Lang");
const signale_1 = require("signale");
class RoleManager {
    constructor() {
        RoleManager.LOGGER.success(`${Lang.INIT_PLUGIN} ${RoleManager.name}`);
    }
    static getInstance() {
        if (!RoleManager.instance) {
            RoleManager.instance = new RoleManager();
        }
        return RoleManager.instance;
    }
}
RoleManager.LOGGER = new signale_1.Signale({
    scope: RoleManager.name
});
exports.RoleManager = RoleManager;
//# sourceMappingURL=RoleManager.js.map