/** @format */

import { Signale } from "signale";

import * as Lang from "@Lib/Lang";

export class Auth {
  private static instance: Auth;

  private static Logger: Signale = new Signale({
    scope: "Twitch/Auth",
  });

  private constructor() {}

  private handleSuccess(): void {
    return Auth.Logger.success(`${Lang.INIT_SERVICE} ${Auth.name}`);
  }

  private handleError<T>(error: T): void {
    return Auth.Logger.error(error);
  }

  public static getLogger(): Signale {
    return Auth.Logger;
  }

  public static getInstance(): Auth {
    if (!Auth.instance) {
      Auth.instance = new Auth();
    }

    return Auth.instance;
  }
}
