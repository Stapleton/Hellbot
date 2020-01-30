/** @format */

import { Signale } from "signale";
import * as DJS from "discord.js";
import * as MDB from "mongodb";

import { MongoDB as MongoDBService, COLLECTIONS } from "@Services/MongoDB";
import { Musicbot } from "@Plugins/Musicbot";
import * as Lang from "@Lib/Lang";
import { CheckForVC } from "@Lib/CheckForVC";

const MongoDB = MongoDBService.getInstance();

export class Delete {
  private Logger: Signale = Musicbot.getLogger();
  private coll: MDB.Collection; // musicbot db collection

  constructor(Message: DJS.Message) {
    if (CheckForVC(Message) == false) return;

    this.coll = MongoDB.getCollection(Message.guild.id, COLLECTIONS.Musicbot);
    let id = Number(Message.content.split(" ")[1]);

    this.coll
      .deleteOne({ ID: id })
      .then(() => this.handleSuccess(id, Message))
      .catch(error => this.handleError(error, Message));
  }

  private handleSuccess(SongID: number, Message: DJS.Message): void {
    Message.channel.send(`Removed song.`);
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`${Lang.ERROR_MSG} \`${Error.message}\``);
    this.Logger.error(Error);
  }
}
