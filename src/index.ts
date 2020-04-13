/** @format */

// Configure environment variables
require("dotenv").config({ path: "private.env" });

// Import all services and plugins
import { TextToSpeech as TextToSpeechPlugin } from "@Plugins/TextToSpeech";
import { RoleManager as RoleManagerPlugin } from "@Plugins/RoleManager";
import { Moderation as ModerationPlugin } from "@Plugins/Moderation";
import { Musicbot as MusicbotPlugin } from "@Plugins/Musicbot";
import { Discord as DiscordService } from "@Services/Discord";
import { MongoDB as MongoDBService } from "@Services/MongoDB";
import { Twitch as TwitchService } from "@Services/Twitch";
import * as Prototypes from "@Lib/Prototypes";
//import { Lib as Library } from "@Lib/Lib";

// Initialize all services and plugins
const TextToSpeech = TextToSpeechPlugin.getInstance();
const RoleManager = RoleManagerPlugin.getInstance();
const Moderation = ModerationPlugin.getInstance();
const Musicbot = MusicbotPlugin.getInstance();
const Discord = DiscordService.getInstance();
const MongoDB = MongoDBService.getInstance();
const Twitch = TwitchService.getInstance();
//const Lib = Library.getInstance();

// Setup Prototypes
declare global {
  interface Array<T> {
    shuffle(): Array<T>;
  }
}

Array.prototype.shuffle = function() {
  return Prototypes.ArrayProtoShuffle(this);
};
