/** @format */

import { Signale } from "signale";
import * as DJS from "discord.js";
import * as MDB from "mongodb";

import { MongoDB as MongoDBService, COLLECTIONS } from "@Services/MongoDB";
import { Musicbot } from "@Plugins/Musicbot";
import * as Lang from "@Lib/Lang";

const MongoDB = MongoDBService.getInstance();

export class Clear {
  private Logger: Signale = Musicbot.getLogger();
  private coll: MDB.Collection; // musicbot db collection

  constructor(Message: DJS.Message) {
    this.coll = MongoDB.getCollection(Message.guild.id, COLLECTIONS.Musicbot);

    try {
      this.coll
        .deleteMany({})
        .then(() => this.handleSuccess(Message))
        .catch(reason => this.handleError(reason, Message));
    } catch (error) {
      this.handleError(error, Message);
    }
  }

  private handleSuccess(Message: DJS.Message): void {
    Message.channel.send(
      `The Intercontinental Heavyweight Champion of the World has crushed the queue.`
    );
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`${Lang.ERROR_MSG} \`${Error.message}\``);
    this.Logger.error(Error);
  }
}
