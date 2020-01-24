/** @format */

import { Signale } from "signale";

import { Discord as DiscordService } from "@Services/Discord";
import * as Lang from "@Lib/Lang";

export class TextToSpeech {
  private static instance: TextToSpeech;

  protected static Logger = new Signale({
    scope: TextToSpeech.name,
  });

  private constructor() {
    TextToSpeech.Logger.success(`${Lang.INIT_PLUGIN} ${TextToSpeech.name}`);

    let Discord = DiscordService.getInstance();

    Discord.on("message", MessageEvent => {
      let split = MessageEvent.content.split(" ");
      let args = {
        token: split[0],
        search: split[1],
      };

      switch (args.token) {
        case "..tts":
          break;
      }
    });
  }

  public static getInstance(): TextToSpeech {
    if (!TextToSpeech.instance) {
      TextToSpeech.instance = new TextToSpeech();
    }

    return TextToSpeech.instance;
  }

  public static getLogger(): Signale {
    return TextToSpeech.Logger;
  }
}
