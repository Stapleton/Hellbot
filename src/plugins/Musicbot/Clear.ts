/** @format */

import { Signale } from "signale";
import * as DJS from "discord.js";
import * as MDB from "mongodb";

import { MongoDB as MongoDBService, COLLECTIONS } from "@Services/MongoDB";
import { Musicbot } from "@Plugins/Musicbot";

const MongoDB = MongoDBService.getInstance();

export class Clear {
  private Logger: Signale = Musicbot.getLogger();
  private coll: MDB.Collection; // musicbot db collection

  constructor(Message: DJS.Message) {
    this.coll = MongoDB.getCollection(Message.guild.id, COLLECTIONS.Musicbot);

    try {
      this.handleSuccess(Message, this.coll.find());
    } catch (error) {
      this.handleError(error, Message);
    }
  }

  private handleSuccess(Message: DJS.Message, Cursor: MDB.Cursor): void {
    // TODO: Finish Queue Clear Command
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.Logger.error(Error);
  }
}
