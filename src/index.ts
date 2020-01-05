// Configure environment variables
require('dotenv').config({ path: 'private.env' });

// Import all services and plugins
import { Discord as DiscordService } from './services/Discord';
import { MongoDB as MongoDBService } from './services/MongoDB';
import { Moderation as ModerationPlugin } from './plugins/Moderation';
import { Musicbot as MusicbotPlugin } from './plugins/Musicbot';
import { RoleManager as RoleManagerPlugin } from './plugins/RoleManager';
import { Lib as Library } from './lib/Lib';

// Initialize all services and plugins
const Discord = DiscordService.getInstance();
const MongoDB = MongoDBService.getInstance();
const Moderation = ModerationPlugin.getInstance();
const Musicbot = MusicbotPlugin.getInstance();
const RoleManager = RoleManagerPlugin.getInstance();
const Lib = Library.getInstance();

// TODO: Make a help module
