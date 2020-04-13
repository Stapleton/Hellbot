/** @format */

import { Signale } from "signale";

import * as Lang from "@Lib/Lang";

export class PubSub {
  private static instance: PubSub;

  private static Logger: Signale = new Signale({
    scope: "Twitch/PubSub",
  });

  private constructor() {}

  private handleSuccess(): void {
    return PubSub.Logger.success(`${Lang.INIT_SERVICE} ${PubSub.name}`);
  }

  private handleError<T>(error: T): void {
    return PubSub.Logger.error(error);
  }

  public static getLogger(): Signale {
    return PubSub.Logger;
  }

  public static getInstance(): PubSub {
    if (!PubSub.instance) {
      PubSub.instance = new PubSub();
    }

    return PubSub.instance;
  }
}
