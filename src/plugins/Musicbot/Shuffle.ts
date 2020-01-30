/** @format */

import { Signale } from "signale";
import * as DJS from "discord.js";
import * as MDB from "mongodb";

import { MongoDB as MongoDBService, COLLECTIONS } from "@Services/MongoDB";
import { Random } from "@Services/MongoDB/Random";
import { Musicbot } from "@Plugins/Musicbot";
import * as Lang from "@Lib/Lang";
import { Lib } from "@Lib/Lib";

const MongoDB = MongoDBService.getInstance();

export class Shuffle {
  private Logger: Signale = Musicbot.getLogger();
  private coll: MDB.Collection; // musicbot db collection

  constructor(Message: DJS.Message) {
    this.coll = MongoDB.getCollection(Message.guild.id, COLLECTIONS.Musicbot);

    //try {

    //}
  }
}
/**
 * TODO: Make a shuffle command
 * ? This may require the entire Play command to be rewritten
 *
 * ? With how things are set up, shuffling the queue would be easier if the queue is copied to memory before use
 * ? but I am strictly trying to prevent copying of the queue
 *
 * ? So I would need to retrieve a random doc from the queue and the play command would need to have that random grab
 * ? toggled on/off, since I don't think shuffling the actual collection is an efficient way of doing it
 *
 * ! This is probably not just a drop in module for the bot.
 */
