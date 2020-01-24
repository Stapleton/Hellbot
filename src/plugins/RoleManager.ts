/** @format */

import { Signale } from "signale";

import { Discord as DiscordService } from "@Services/Discord";
import { Link } from "@Plugins/RoleManager/Link";
import * as Lang from "@Lib/Lang";

export class RoleManager {
  private static instance: RoleManager;

  protected static Logger: Signale = new Signale({
    scope: RoleManager.name,
  });

  private constructor() {
    RoleManager.Logger.success(`${Lang.INIT_PLUGIN} ${RoleManager.name}`);

    let Discord = DiscordService.getInstance();

    Discord.on("message", MessageEvent => {
      let token = MessageEvent.content.split(" ")[0];

      switch (token) {
        case ".link":
          new Link(MessageEvent);
          break;
      }
    });
  }

  public static getInstance(): RoleManager {
    if (!RoleManager.instance) {
      RoleManager.instance = new RoleManager();
    }

    return RoleManager.instance;
  }

  public static getLogger(): Signale {
    return RoleManager.Logger;
  }
}
