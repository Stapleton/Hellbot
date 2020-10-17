/** @format */

const ytdlrun = require("ytdl-run");
import { Signale } from "signale";
import * as DJS from "discord.js";
import * as MDB from "mongodb";

import { MongoDB as MongoDBService, COLLECTIONS } from "@Services/MongoDB";
import { SongEmbed as Embed } from "@Lib/Embed";
import { Join } from "@Services/Discord/Join";
import { Musicbot } from "@Plugins/Musicbot";
import * as Lang from "@Lib/Lang";
import { CheckForVC } from "@Lib/CheckForVC";

const MongoDB = MongoDBService.getInstance();

export class Play {
  private Logger: Signale = Musicbot.getLogger();
  private coll: MDB.Collection;

  constructor(Message: DJS.Message) {
    if (CheckForVC(Message) == false) return;

    this.coll = MongoDB.getCollection(Message.guild.id, COLLECTIONS.Musicbot);
    if (!Message.member.voice.connection) new Join(Message);

    this.coll
      .findOneAndDelete({ Playing: false })
      .then(result => this.handleSuccess(result, Message))
      .catch(error => this.handleError(error, Message));
  }

  private handleSuccess(
    Result: MDB.FindAndModifyWriteOpResultObject<any>,
    Message: DJS.Message
  ): void {
    if (Result.value == null) {
      Message.channel.send(`End of Queue`);
      return;
    }

    const Stream = ytdlrun.stream(Result.value.URL).stdout;

    Message.member.voice.connection.play(Stream, {
      volume: 0.3,
      bitrate: "auto",
      fec: true,
    });
    Message.member.voice.connection.dispatcher.once("end", () => {
      new Play(Message);
    });

    new Embed(Message, Result.value, "Playing");
  }

  private handleError(Error: MDB.MongoError, Message: DJS.Message): void {
    Message.channel.send(`${Lang.ERROR_MSG} \`${Error.message}\``);
    this.Logger.error(Error);
  }
}
