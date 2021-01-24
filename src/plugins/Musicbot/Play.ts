/** @format */

import * as ytdl from "ytdl-core";
import { Signale } from "signale";
import * as DJS from "discord.js";
import * as MDB from "mongodb";
import { Readable } from "stream";

import { MongoDB as MongoDBService, COLLECTIONS } from "@Services/MongoDB";
import { Discord as DiscordService } from "@Services/Discord";
import { SongEmbed as Embed } from "@Lib/Embed";
import { Join } from "@Services/Discord/Join";
import { Musicbot } from "@Plugins/Musicbot";
import * as Lang from "@Lib/Lang";
import { CheckForVC } from "@Lib/CheckForVC";

const MongoDB = MongoDBService.getInstance();
const Discord = DiscordService.getInstance();

export class Play {
  private Logger: Signale = Musicbot.getLogger();
  private coll: MDB.Collection;
  private vonn: DJS.VoiceConnection;

  constructor(Message: DJS.Message) {
    if (CheckForVC(Message) == false) return;

    try {
      new Join(Message);
    } catch (e) {
      this.handleError(e, Message);
    }

    this.vonn = Discord.voice.connections.get(Message.guild.id);

    this.coll = MongoDB.getCollection(Message.guild.id, COLLECTIONS.Musicbot);
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

    this.processVideo(Result.value.URL).then(stream => {
      this.vonn.play(stream, {
        volume: 0.3,
        bitrate: "auto",
        fec: true,
      });
      this.vonn.once("end", () => {
        new Play(Message);
      });
    });

    new Embed(Message, Result.value, "Playing");
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`${Lang.ERROR_MSG} \`${Error.message}\``);
    this.Logger.error(Error);
  }

  private async processVideo(url: string): Promise<Readable> {
    let info = await ytdl.getInfo(url);
    ytdl.chooseFormat(info.formats, { quality: "highestaudio" });
    return ytdl.downloadFromInfo(info);
  }
}
