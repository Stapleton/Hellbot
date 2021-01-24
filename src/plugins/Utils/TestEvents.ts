/** @format */

import * as DJS from "discord.js";
import { default as chalk } from "chalk";

import { Discord as DiscordService } from "@Services/Discord";
import { EventBus as EventBusLib, EventItem } from "@Lib/EventBus";

const EventBus = EventBusLib.getInstance();

export class TestEvents {
  private inputPattern: RegExp = /(?:([a-zA-Z]+):([a-zA-Z]+):([a-zA-Z0-9!@#$%^&*\(\)_\-+={}\[\]|\\:;"'<>\,\.?/~\s]+))/g;
  private eventPattern: RegExp = /(?<service>[a-zA-Z]+):(?<name>[a-zA-Z]+):(?<listener>[a-zA-Z0-9!@#$%^&*\(\)_\-+={}\[\]|\\:;"'<>\,\.?/~\s]+)/g;
  private eventList: EventItem[] = [];
  private message: DJS.Message;

  constructor(message: DJS.Message) {
    this.message = message;
    let repeatCount = new Number(message.content.split(" ")[1]);
    let inputEvents: RegExpMatchArray = message.content.match(this.inputPattern);

    inputEvents.map((value, index) => {
      let match = this.eventPattern.exec(value)["groups"];
      //console.log(match);
      this.eventList[index] = { service: match.service, name: match.name, listener: match.listener };
    });

    //console.log(this.eventList);

    for (let i = 1; i <= repeatCount; i++) {
      this.eventList.forEach((value: EventItem | any) => this.registerEvent(value));
    }
  }

  private registerEvent(event: EventItem): void {
    try {
      EventBus.addQueueItem(event.service, event);
      this.message.react("👌").then((_) => EventBus.emit(event.service));
    } catch (e) {
      this.message.react("❌");
      console.log(chalk.red(e));
    }
  }
}
