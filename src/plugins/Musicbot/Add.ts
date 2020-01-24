/** @format */

const ytdlrun = require("ytdl-run");
import { Signale } from "signale";
import * as DJS from "discord.js";
import * as MDB from "mongodb";

import { MongoDB as MongoDBService, COLLECTIONS } from "@Services/MongoDB";
import { SongEmbed as Embed } from "@Lib/SongEmbed";
import { Play } from "@Plugins/Musicbot/Play";
import { Musicbot } from "@Plugins/Musicbot";
import { Song } from "@Lib/Song";
import { Lib } from "@Lib/Lib";

// get the singleton instance for MongoDB
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
    Thumbnail:
      "https://cdn.discordapp.com/attachments/595858296385175552/653684368354705408/circle_game-1.jpg",
    Channel: ":Pog:",
    Playing: false,
  };

  constructor(
    Message: DJS.Message,
    embed: boolean = true,
    play: boolean = false
  ) {
    if (Lib.checkForVC(Message) == false) return;

    //this.Logger.debug(`Got Song`);
    this.coll = MongoDB.getCollection(Message.guild.id, COLLECTIONS.Musicbot);
    this.Song.RequestedBy = Message.author.username;

    // search terms that can come after .play
    let search: string = Message.content.split(" ")[1];

    // if there are no search terms, play the songs in the queue
    // if there are search terms, get the info from the terms, and run the routine {Join, Add, Play}
    if (typeof search === "undefined") {
      this.addSong(Message, embed, play);
    } else {
      this.Song.Search = Message.content
        .split(" ")
        .slice(1)
        .join(" ");
      ytdlrun
        .getInfo(["--default-search", "ytsearch", this.Song.Search])
        .then(info => this.handleSuccess(info, Message, embed, play))
        .catch(error => this.handleError(error, Message));
    }

    //Message.channel.send(`\`\`\`json\n${JSON.stringify(this.Song)}\`\`\``);
  }

  private handleSuccess(
    Info: { [key: string]: any },
    Message: DJS.Message,
    embed: boolean,
    play: boolean
  ): void {
    this.Song.Length = Lib.convertMin(Info.duration);
    this.Song.Name = Info.title;
    this.Song.Thumbnail = Info.thumbnail;
    this.Song.Channel = Info.uploader;
    this.Song.URL = Info.webpage_url;
    this.addSong(Message, embed, play);
  }

  private handleError(Error: Error, Message: DJS.Message): void {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.Logger.error(Error);
  }

  private addSong(Message: DJS.Message, embed: boolean, play: boolean): void {
    this.Song.ID = Math.floor(Math.random() * 1000);

    this.coll.insertOne(this.Song);
    //this.Logger.debug(`Added Song`);

    if (embed) new Embed(Message, this.Song, "Added");
    if (play) new Play(Message);
  }
}
