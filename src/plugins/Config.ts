/** @format */

import { Signale } from "signale";
import * as Toml from "toml";
import * as fs from "fs";

import * as Lang from "@Lib/Lang";

export class Config {
  private static instance: Config;

  private static Logger: Signale = new Signale({
    scope: "Config",
  });

  private constructor() {
    try {
      fs.existsSync("@Config/Hellbot.toml");
      this.handleSuccess();
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleSuccess(): void {
    return Config.Logger.success(`${Lang.INIT_PLUGIN} ${Config.name}`);
  }

  private handleError<T>(error: T): void {
    return Config.Logger.error(error);
  }

  public static getLogger(): Signale {
    return Config.Logger;
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }

    return Config.instance;
  }
}
