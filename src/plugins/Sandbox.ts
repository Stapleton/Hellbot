/** @format */

import { Signale } from "signale";

import { Discord as DiscordService } from "@Services/Discord";
import * as $ from "@Plugins/Sandbox/TwitchWebhook";
import * as Lang from "@Lib/Lang";

export class Sandbox {
  private static instance: Sandbox;

  protected static Logger = new Signale({
    scope: Sandbox.name,
  });

  private constructor() {
    Sandbox.Logger.success(`${Lang.INIT_PLUGIN} ${Sandbox.name}`);

    let Discord = DiscordService.getInstance();

    Discord.on("message", MessageEvent => {
      let split = MessageEvent.content.split(" ");
      let args: { [key: string]: string } = {
        token: split[0],
        search: split[1],
      };

      switch (args.token) {
        case "..webhook":
          break;
      }
    });
  }

  public static getLogger(): Signale {
    return Sandbox.Logger;
  }

  public static getInstance(): Sandbox {
    if (!Sandbox.instance) {
      Sandbox.instance = new Sandbox();
    }

    return Sandbox.instance;
  }
}
