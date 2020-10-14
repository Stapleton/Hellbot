/** @format */

import { Signale } from "signale";

import * as Lang from "@Lib/Lang";

export class Webhooks {
  private static instance: Webhooks;

  private static Logger: Signale = new Signale({
    scope: "Twitch/Webhooks",
  });

  private constructor() {}

  private handleSuccess(): void {
    return Webhooks.Logger.success(`${Lang.INIT_SERVICE} ${Webhooks.name}`);
  }

  private handleError<T>(error: T): void {
    return Webhooks.Logger.error(error);
  }

  public static getLogger(): Signale {
    return Webhooks.Logger;
  }

  public static getInstance(): Webhooks {
    if (!Webhooks.instance) {
      Webhooks.instance = new Webhooks();
    }

    return Webhooks.instance;
  }
}
