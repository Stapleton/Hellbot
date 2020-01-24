/** @format */

// Configure environment variables
require("dotenv").config({ path: "private.env" });

// Import all services and plugins
import { Discord as DiscordService } from "@Services/Discord";
import { MongoDB as MongoDBService } from "@Services/MongoDB";
import { Moderation as ModerationPlugin } from "@Plugins/Moderation";
import { Musicbot as MusicbotPlugin } from "@Plugins/Musicbot";
import { RoleManager as RoleManagerPlugin } from "@Plugins/RoleManager";
import { Lib as Library } from "@Lib/Lib";

// Initialize all services and plugins
const Discord = DiscordService.getInstance();
const MongoDB = MongoDBService.getInstance();
const Moderation = ModerationPlugin.getInstance();
const Musicbot = MusicbotPlugin.getInstance();
const RoleManager = RoleManagerPlugin.getInstance();
const Lib = Library.getInstance();

// TODO: Make a help module
