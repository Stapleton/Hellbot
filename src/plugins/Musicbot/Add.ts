/** @format */

import * as ytdl from "ytdl-core";
import { Signale } from "signale";
import * as DJS from "discord.js";
import * as MDB from "mongodb";
import * as ytsr from "ytsr";

import { MongoDB as MongoDBService, COLLECTIONS } from "@Services/MongoDB";
import { SongEmbed as Embed } from "@Lib/Embed";
import { Play } from "@Plugins/Musicbot/Play";
import { Musicbot } from "@Plugins/Musicbot";
import { CheckForVC } from "@Lib/CheckForVC";
import { ConvertMin } from "@Lib/ConvertMin";
import * as Lang from "@Lib/Lang";
import { Song } from "@Lib/Types";

// * get the singleton instance for MongoDB
const MongoDB = MongoDBService.getInstance();

export class Add {
  private Logger: Signale = Musicbot.getLogger();
  private coll: MDB.Collection; // musicbot db collection

  private Song: Song = {
    ID: 13378675309,
    URL: "https://www.youtube.com/watch?v=QsC6pfLisU4",
    Search: "You didn't search anything.",
    RequestedBy: "Whoever ran the command.",
    Length: "69:42:00",
    Name: "Is the safe done?",
    Thumbnail: "https://cdn.discordapp.com/attachments/595858296385175552/653684368354705408/circle_game-1.jpg",
    Channel: ":Pog:",
    Playing: false,
  };

  constructor(Message: DJS.Message, embed: boolean = true, play: boolean = false) {
    if (CheckForVC(Message) === false) return;

    // * Get MongoDB Collection
    this.coll = MongoDB.getCollection(Message.guild.id, COLLECTIONS.Musicbot);
    this.Song.RequestedBy = Message.author.username;

    // * search terms that can come after .play
    let search: string = Message.content.split(" ")[1];

    // * if there are no search terms, play the songs in the queue
    // * if there are search terms, get the info from the terms, and run the routine {Join, Add, Play}
    if (typeof search === "undefined") {
      this.addSong(Message, embed, play);
    } else {
      this.Song.Search = Message.content
        .split(" ")
        .slice(1)
        .join(" ");
      ytdl
        .getInfo(`"${this.Song.Search}"`)
        .then(info => this.handleSuccess(info, Message, embed, play))
        .catch(error => this.handleError(error, Message));
    }

    // Message.channel.send(`\`\`\`json\n${JSON.stringify(this.Song)}\`\`\``);
  }

  private handleSuccess(Info: ytdl.videoInfo, Message: DJS.Message, embed: boolean, play: boolean): void {
    this.Song.Length = ConvertMin(Info.videoDetails.lengthSeconds);
    this.Song.Name = Info.videoDetails.title;
    this.Song.Thumbnail = Info.thumbnail_url;
    this.Song.Channel = Info.videoDetails.ownerChannelName;
    this.Song.URL = Info.videoDetails.video_url;
    this.addSong(Message, embed, play);
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`${Lang.ERROR_MSG} \`${Error.message}\``);
    this.Logger.error(Error);
  }

  private addSong(Message: DJS.Message, embed: boolean, play: boolean): void {
    this.Song.ID = Math.floor(Math.random() * 1000);

    this.coll.insertOne(this.Song);
    // this.Logger.debug(`Added Song`);

    if (embed) new Embed(Message, this.Song, "Added");
    if (play) new Play(Message);
  }
}
