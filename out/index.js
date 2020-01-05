"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: 'private.env' });
const Discord_1 = require("./services/Discord");
const MongoDB_1 = require("./services/MongoDB");
const Moderation_1 = require("./plugins/Moderation");
const Musicbot_1 = require("./plugins/Musicbot");
const RoleManager_1 = require("./plugins/RoleManager");
const Lib_1 = require("./lib/Lib");
const Discord = Discord_1.Discord.getInstance();
const MongoDB = MongoDB_1.MongoDB.getInstance();
const Moderation = Moderation_1.Moderation.getInstance();
const Musicbot = Musicbot_1.Musicbot.getInstance();
const RoleManager = RoleManager_1.RoleManager.getInstance();
const Lib = Lib_1.Lib.getInstance();
//# sourceMappingURL=index.js.map