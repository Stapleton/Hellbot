/** @format */

import * as Child from "child_process";
import * as DJS from "discord.js";
import { Signale } from "signale";

import { Musicbot } from "@Plugins/Musicbot";
import * as Lang from "@Lib/Lang";

export class Intro {
  static Logger: Signale = Musicbot.getLogger();

  constructor(Message: DJS.Message) {
    Intro.Logger.success(`${Lang.INIT_PLUGIN} ${Intro.name}`);

    Child.exec("");
  }
}
