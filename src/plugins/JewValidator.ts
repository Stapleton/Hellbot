/** @format */

import { Signale } from "signale";
import * as DJS from "discord.js";

import { Discord as DiscordService } from "@Services/Discord";
import { Validator } from '@Plugins/JewValidator/Validator'
import * as Lang from "@Lib/Lang";

export class JewValidator {
  private static instance: JewValidator;

  protected static Logger: Signale = new Signale({
    scope: JewValidator.name,
  });

  private constructor() {
    let Discord: DJS.Client = DiscordService.getInstance();

    Discord.on("message", (MessageEvent: DJS.Message) => {
      if (!MessageEvent.content.startsWith('.moviejews')) return;
      let slug = MessageEvent.content.split(' ')[1];

      new Validator(slug).compare().then(val => {
        MessageEvent.reply(val);
      });
    });

    JewValidator.Logger.success(`${Lang.INIT_PLUGIN} ${JewValidator.name}`);
  }

  public static getLogger(): Signale {
    return JewValidator.Logger;
  }

  public static getInstance(): JewValidator {
    if (!JewValidator.instance) {
      JewValidator.instance = new JewValidator();
    }

    return JewValidator.instance;
  }
}
