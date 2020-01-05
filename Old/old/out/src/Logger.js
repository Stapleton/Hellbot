"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signale_1 = require("signale");
class Logger extends signale_1.Signale {
    constructor(scope, types, interactive) {
        super({ scope: scope, types: types, interactive: interactive });
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map