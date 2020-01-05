"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MDB = require("mongodb");
const signale_1 = require("signale");
const Lang = require("../lib/Lang");
class MongoDB extends MDB.MongoClient {
    constructor() {
        super(process.env.MONGODB, {
            authSource: "admin",
            auth: {
                user: process.env.MONGODB_USER,
                password: process.env.MONGODB_PASS
            },
            appname: "Hellbot",
            useNewUrlParser: true,
            forceServerObjectId: true,
            useUnifiedTopology: true
        });
        this.connect().then(this.handleConnect).catch(this.handleError);
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
    getDB() {
        return this.db("224178589157818368", { returnNonCachedInstance: true });
    }
    getMusicbot() {
        return this.getDB().collection("musicbot");
    }
    getRoleManager() {
        return this.getDB().collection("roleManager");
    }
    getModeration() {
        return this.getDB().collection("moderation");
    }
}
MongoDB.LOGGER = new signale_1.Signale({
    scope: 'MongoDB'
});
exports.MongoDB = MongoDB;
//# sourceMappingURL=MongoDB.js.map