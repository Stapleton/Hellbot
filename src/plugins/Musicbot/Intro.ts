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

// TODO: Left off last night at 7:35AM, integrating tts-cli so when the bot joins a voice channel
// TODO: It says "First name: Tiger. Last name: Games."
// TODO: If there is music in the queue, it will start playing after, if not it will wait for the .play command
// TODO: tts-cli needs to be executed as a child process, using google cloud platform.
