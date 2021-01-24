/** @format */

import { Signale } from "signale";

import { Discord as DiscordService } from "@Services/Discord";
import * as Lang from "@Lib/Lang";

import { GetProfilePic } from "@Plugins/Utils/GetProfilePic";
import { ServerDeafen } from "@Plugins/Utils/ServerDeafen";
import { TestEvents } from "@Plugins/Utils/TestEvents";

export class Utils {
  private static instance: Utils;

  protected static Logger = new Signale({
    scope: Utils.name,
  });

  private constructor() {
    Utils.Logger.success(`${Lang.INIT_PLUGIN} ${Utils.name}`);

    let Discord = DiscordService.getInstance();

    Discord.on("message", (MessageEvent) => {
      let split = MessageEvent.content.split(" ");
      let args: { [key: string]: string } = {
        token: split[0],
        search: split[1],
      };

      switch (args.token) {
        case ".getProfilePic":
          new GetProfilePic(MessageEvent);
          break;
        case ".deaf":
          new ServerDeafen(MessageEvent);
          break;
        case ".testevent":
          new TestEvents(MessageEvent);
          break;
      }
    });
  }

  public static getLogger(): Signale {
    return Utils.Logger;
  }

  public static getInstance(): Utils {
    if (!Utils.instance) {
      Utils.instance = new Utils();
    }

    return Utils.instance;
  }
}
