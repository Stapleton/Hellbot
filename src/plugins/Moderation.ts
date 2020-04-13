/** @format */

import * as Lang from "@Lib/Lang";

import { Signale } from "signale";

export class Moderation {
  private static instance: Moderation;

  protected static Logger: Signale = new Signale({
    scope: Moderation.name,
  });

  private constructor() {
    Moderation.Logger.success(`${Lang.INIT_PLUGIN} ${Moderation.name}`);
  }

  public static getLogger(): Signale {
    return Moderation.Logger;
  }

  public static getInstance(): Moderation {
    if (!Moderation.instance) {
      Moderation.instance = new Moderation();
    }

    return Moderation.instance;
  }
}
