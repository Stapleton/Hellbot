/** @format */

import { Signale } from "signale";

export default class Logger extends Signale {
  private static instance: Logger;

  private constructor() {
    super({
      disabled: false,
      interactive: false,
    });
  }

  public static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }
}
