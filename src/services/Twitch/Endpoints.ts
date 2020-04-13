/** @format */

import { Signale } from "signale";

import * as Lang from "@Lib/Lang";

export class Endpoints {
  private static instance: Endpoints;

  private static Logger: Signale = new Signale({
    scope: "Twitch/Endpoints",
  });

  private constructor() {}

  private handleSuccess(): void {
    return Endpoints.Logger.success(`${Lang.INIT_SERVICE} ${Endpoints.name}`);
  }

  private handleError<T>(error: T): void {
    return Endpoints.Logger.error(error);
  }

  public static getLogger(): Signale {
    return Endpoints.Logger;
  }

  public static getInstance(): Endpoints {
    if (!Endpoints.instance) {
      Endpoints.instance = new Endpoints();
    }

    return Endpoints.instance;
  }
}
