/** @format */

import { Signale } from "signale";

import { Discord as DiscordService } from "@Services/Discord";
import { TestEmbed } from "@Lib/TestEmbed";
import * as Lang from "@Lib/Lang";

export class Lib {
  private static instance: Lib;

  protected static Logger: Signale = new Signale({
    scope: "Lib",
  });

  // this is a singleton class
  private constructor() {
    Lib.Logger.success(`${Lang.INIT_PLUGIN} ${Lib.name}`);

    let Discord = DiscordService.getInstance();

    Discord.on("message", MessageEvent => {
      let token = MessageEvent.content.split(" ")[0];

      switch (token) {
        case ".testembed":
          new TestEmbed(MessageEvent);
          break;
      }
    });
  }

  public static getInstance(): Lib {
    if (!Lib.instance) {
      Lib.instance = new Lib();
    }

    return Lib.instance;
  }

  public static getLogger(): Signale {
    return this.Logger;
  }
}
