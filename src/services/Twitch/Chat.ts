/** @format */

import { Signale } from "signale";

import * as Lang from "@Lib/Lang";

export class Chat {
  private static instance: Chat;

  private static Logger: Signale = new Signale({
    scope: "Twitch/Chat",
  });

  private constructor() {}

  private handleSuccess(): void {
    return Chat.Logger.success(`${Lang.INIT_SERVICE} ${Chat.name}`);
  }

  private handleError<T>(error: T): void {
    return Chat.Logger.error(error);
  }

  public static getLogger(): Signale {
    return Chat.Logger;
  }

  public static getInstance(): Chat {
    if (!Chat.instance) {
      Chat.instance = new Chat();
    }

    return Chat.instance;
  }
}
