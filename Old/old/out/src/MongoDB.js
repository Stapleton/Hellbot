"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
const MDB = require("mongodb");
class MongoDB extends MDB.MongoClient {
    constructor() {
        super(process.env.MONGODB, {
            authSource: "admin",
            auth: {
                user: process.env.MONGODB_USER,
                password: process.env.MONGODB_PASS
            },
            appname: "Alloybot",
            useNewUrlParser: true,
            forceServerObjectId: true
        });
        this.Logger = new Logger_1.Logger('MongoDB');
        this.connect().then(() => {
        });
    }
}
//# sourceMappingURL=MongoDB.js.map