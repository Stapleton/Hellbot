/** @format */

import { Signale } from "signale";

import * as Lang from "@Lib/Lang";

export class API {
  private static instance: API;

  private static Logger: Signale = new Signale({
    scope: "Twitch/API",
  });

  private constructor() {}

  private handleSuccess(): void {
    return API.Logger.success(`${Lang.INIT_SERVICE} ${API.name}`);
  }

  private handleError<T>(error: T): void {
    return API.Logger.error(error);
  }

  public static getLogger(): Signale {
    return API.Logger;
  }

  public static getInstance(): API {
    if (!API.instance) {
      API.instance = new API();
    }

    return API.instance;
  }
}
