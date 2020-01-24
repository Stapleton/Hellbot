/** @format */

import * as MDB from "mongodb";
import { Signale } from "signale";
import * as Lang from "@Lib/Lang";

export enum COLLECTIONS {
  Musicbot = "musicbot",
  RoleManager = "roleman",
  Moderation = "moderation",
}

export class MongoDB extends MDB.MongoClient {
  private static instance: MongoDB;

  protected static Logger = new Signale({
    scope: "MongoDB",
  });

  // Private constructor, this is a singleton class
  private constructor() {
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

  private handleConnect(): void {
    return MongoDB.Logger.success(`${Lang.INIT_SERVICE} ${MongoDB.name}`);
  }

  private handleError<T>(error: T): void {
    return MongoDB.Logger.error(error);
  }

  public static getInstance(): MongoDB {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB();
    }

    return MongoDB.instance;
  }

  public getDB(guildid: string): MDB.Db {
    return this.db(guildid, { returnNonCachedInstance: true });
  }

  public getCollection(guildid: string, collection: string): MDB.Collection {
    return this.getDB(guildid).collection(collection);
  }
}
