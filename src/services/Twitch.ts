/** @format */

import { Signale } from "signale";

import * as Lang from "@Lib/Lang";

export class Twitch {
  private static instance: Twitch;

  private static Logger: Signale = new Signale({
    scope: "Twitch",
  });

  private constructor() {}

  private handleSuccess(): void {
    return Twitch.Logger.success(`${Lang.INIT_SERVICE} ${Twitch.name}`);
  }

  private handleError<T>(error: T): void {
    return Twitch.Logger.error(error);
  }

  public static getLogger(): Signale {
    return Twitch.Logger;
  }

  public static getInstance(): Twitch {
    if (!Twitch.instance) {
      Twitch.instance = new Twitch();
    }

    return Twitch.instance;
  }
}
