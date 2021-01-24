/** @format */

import { EventEmitter } from "events";
import { default as chalk } from "chalk";

import { TextToSpeech as TextToSpeechPlugin } from "@Plugins/TextToSpeech";
import { RoleManager as RoleManagerPlugin } from "@Plugins/RoleManager";
import { Moderation as ModerationPlugin } from "@Plugins/Moderation";
import { Musicbot as MusicbotPlugin } from "@Plugins/Musicbot";

import { Discord as DiscordService } from "@Services/Discord";
import { MongoDB as MongoDBService } from "@Services/MongoDB";
import { Twitch as TwitchService } from "@Services/Twitch";

const TextToSpeech = TextToSpeechPlugin.getInstance();
const RoleManager = RoleManagerPlugin.getInstance();
const Moderation = ModerationPlugin.getInstance();
const Musicbot = MusicbotPlugin.getInstance();

const Discord = DiscordService.getInstance();
const MongoDB = MongoDBService.getInstance();
const Twitch = TwitchService.getInstance();

export type EventItem = { service: string; name: string; listener: string };

export class EventBus extends EventEmitter {
  private static instance: EventBus;
  protected queue: { [key: string]: EventItem[] } = {
    discord: [],
    mongodb: [],
  };

  private constructor() {
    super();

    this.on("discord", (_) => {
      let i = this.queue.discord.shift();
      try {
        Discord.prependOnceListener(i.name, eval(i.listener));
      } catch (e) {
        console.log(chalk.red(e));
      }
    });

    this.on("mongodb", (_) => {
      let i = this.queue.mongodb.shift();
      try {
        MongoDB.prependOnceListener(i.name, eval(i.listener));
      } catch (e) {
        console.log(chalk.red(e));
      }
    });
  }

  public addQueueItem(list: string, item: EventItem) {
    this.queue[list].push(item);
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }

    return EventBus.instance;
  }
}
