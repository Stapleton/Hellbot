/** @format */

import { Signale } from "signale";
import * as DJS from "discord.js";

import { Discord as DiscordService } from "@Services/Discord";
import * as Lang from "@Lib/Lang";

import { Join } from "@Services/Discord/Join";
import { Leave } from "@Services/Discord/Leave";
import { Stop } from "@Services/Discord/Stop";
import { Volume } from "@Services/Discord/Volume";
import { Pause } from "@Services/Discord/Pause";
import { Resume } from "@Services/Discord/Resume";

import { Add } from "@Plugins/Musicbot/Add";
import { Clear } from "@Plugins/Musicbot/Clear";
import { Delete } from "@Plugins/Musicbot/Delete";
import { Play } from "@Plugins/Musicbot/Play";
import { Repeat } from "@Plugins/Musicbot/Repeat";
import { Shuffle } from "@Plugins/Musicbot/Shuffle";

export class Musicbot {
  private static instance: Musicbot;

  protected static Logger: Signale = new Signale({
    scope: Musicbot.name,
  });

  private constructor() {
    Musicbot.Logger.success(`${Lang.INIT_PLUGIN} ${Musicbot.name}`);

    let Discord: DJS.Client = DiscordService.getInstance();

    Discord.on("message", (MessageEvent: DJS.Message) => {
      let split: string[] = MessageEvent.content.split(" ");
      let args: { [key: string]: string } = {
        token: split[0],
        search: split[1],
      };

      switch (args.token) {
        case ".join":
          new Join(MessageEvent);
          break;

        case ".leave":
          new Leave(MessageEvent);
          break;

        case ".add":
          new Add(MessageEvent);
          break;

        case ".play":
          if (typeof args.search != "undefined") {
            new Add(MessageEvent, false, true);
          } else {
            new Play(MessageEvent);
          }
          break;

        case ".stop":
          new Stop(MessageEvent);
          break;

        case ".pause":
          new Pause(MessageEvent);
          break;

        case ".resume":
          new Resume(MessageEvent);
          break;

        case ".skip":
          new Stop(MessageEvent);
          new Play(MessageEvent);
          break;

        case ".volume":
          new Volume(MessageEvent);
          break;

        case ".del":
          new Delete(MessageEvent);
          break;

        case ".clear":
          new Clear(MessageEvent);
          break;

        case ".shuffle":
        case ".repeat":
          MessageEvent.channel.send(`Not Yet Implemented.`);
          break;
      }
    });
  }

  public static getInstance(): Musicbot {
    if (!Musicbot.instance) {
      Musicbot.instance = new Musicbot();
    }

    return Musicbot.instance;
  }

  public static getLogger(): Signale {
    return Musicbot.Logger;
  }
}
