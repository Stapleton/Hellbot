/** @format */

// Configure environment variables
require("dotenv").config({ path: "private.env" });

// Import logger for stdout formatting
import { Signale } from "signale";
const logger = new Signale({
  scope: "stdout",
});

// Import all services and plugins
import { TextToSpeech as TextToSpeechPlugin } from "@Plugins/TextToSpeech";
import { JewValidator as JewValidatorPlugin } from "@Plugins/JewValidator";
import { RoleManager as RoleManagerPlugin } from "@Plugins/RoleManager";
import { Moderation as ModerationPlugin } from "@Plugins/Moderation";
import { Musicbot as MusicbotPlugin } from "@Plugins/Musicbot";
import { Utils as UtilsPlugin } from "@Plugins/Utils";

import { Discord as DiscordService } from "@Services/Discord";
import { MongoDB as MongoDBService } from "@Services/MongoDB";
import { Twitch as TwitchService } from "@Services/Twitch";
import * as Prototypes from "@Lib/Prototypes";
//import { Lib as Library } from "@Lib/Lib";

// Initialize all services and plugins
const JewValidator = JewValidatorPlugin.getInstance();
const TextToSpeech = TextToSpeechPlugin.getInstance();
const RoleManager = RoleManagerPlugin.getInstance();
const Moderation = ModerationPlugin.getInstance();
const Musicbot = MusicbotPlugin.getInstance();
const Utils = UtilsPlugin.getInstance();

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

Discord.on("message", (message) => {
  if (message.author.id === Discord.user.id) return;
});
