/** @format */

import { Signale } from "signale";
import * as DJS from "discord.js";
import * as MDB from "mongodb";

import { MongoDB as MongoDBService, COLLECTIONS } from "@Services/MongoDB";
import { RoleManager } from "@Plugins/RoleManager";
import { Lib } from "@Lib/Lib";

const MongoDB = MongoDBService.getInstance();

export class Link {
  private Logger: Signale = RoleManager.getLogger();
  private coll: MDB.Collection;

  constructor(Message: DJS.Message) {
    let allowed: boolean = Lib.checkForPerms(Message, "MANAGE_ROLES");
    if (!allowed) return;

    this.coll = MongoDB.getCollection(
      Message.guild.id,
      COLLECTIONS.RoleManager
    );

    let split: string[] = Message.content.split(" ");
    let args: { [key: string]: string } = {
      role: split[1],
      emote: split[2],
    };

    this.coll
      .insertOne(args)
      .then(value => {
        this.handleSuccess(Message, value);
      })
      .catch(error => {
        this.handleError(error, Message);
      });
  }

  private handleSuccess<T>(
    Message: DJS.Message,
    Success: MDB.InsertOneWriteOpResult<T>
  ): void {
    Message.channel.send(`*Mmmmm. Yeaahhhh*`);
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.Logger.error(Error);
  }
}
