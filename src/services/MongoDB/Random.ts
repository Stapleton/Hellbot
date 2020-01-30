/** @format */

import { Signale } from "signale";
import * as MDB from "mongodb";

import { MongoDB as MongoDBService } from "@Services/MongoDB";
import * as Lang from "@Lib/Lang";

export class Random {
  constructor(collection: MDB.Collection, query: object = {}) {
    query["random"] = { $lte: Math.random() };
    let cur = collection.find(query).sort({ random: -1 });
    if (!cur.hasNext()) {
      delete query["random"];
      cur = collection.find(query).sort({ random: -1 });
    }
    let doc = cur.next();
    doc["random"] = Math.random();
    collection.update({ _id: doc["_id"] }, doc);
    return doc;
  }
}
/**
 * * https://stackoverflow.com/a/21867984
 * ? Implemented this while trying to create a shuffle command for the Musicbot
 */
