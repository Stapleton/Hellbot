/** @format */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MDB = require("mongodb");
const signale_1 = require("signale");
const Lang = require("../lib/Lang");
var COLLECTIONS;
(function(COLLECTIONS) {
  COLLECTIONS["Musicbot"] = "musicbot";
  COLLECTIONS["RoleManager"] = "roleman";
  COLLECTIONS["Moderation"] = "moderation";
})((COLLECTIONS = exports.COLLECTIONS || (exports.COLLECTIONS = {})));
class MongoDB extends MDB.MongoClient {
  constructor() {
    super(process.env.MONGODB, {
      authSource: "admin",
      auth: {
        user: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASS,
      },
      appname: "Hellbot",
      useNewUrlParser: true,
      forceServerObjectId: true,
      useUnifiedTopology: true,
    });
    this.connect()
      .then(this.handleConnect)
      .catch(this.handleError);
  }
  handleConnect() {
    return MongoDB.LOGGER.success(`${Lang.INIT_SERVICE} ${MongoDB.name}`);
  }
  handleError(error) {
    return MongoDB.LOGGER.error(error);
  }
  static getInstance() {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB();
    }
    return MongoDB.instance;
  }
  getDB(guildid) {
    return this.db(guildid, { returnNonCachedInstance: true });
  }
  getCollection(guildid, collection) {
    return this.getDB(guildid).collection(collection);
  }
}
MongoDB.LOGGER = new signale_1.Signale({ scope: "MongoDB" });
exports.MongoDB = MongoDB;
