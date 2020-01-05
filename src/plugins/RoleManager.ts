import { Discord as DiscordService } from '../services/Discord';
import { MongoDB as MongoDBService } from '../services/MongoDB';
import * as Lang from '../lib/Lang';

import { Signale } from 'signale';

export class RoleManager {
  private static instance: RoleManager;

  protected static LOGGER = new Signale({
    scope: RoleManager.name
  });
  
  private constructor() {
    RoleManager.LOGGER.success(`${Lang.INIT_PLUGIN} ${RoleManager.name}`);
  }

  public static getInstance(): RoleManager {
    if (!RoleManager.instance) {
      RoleManager.instance = new RoleManager();
    }

    return RoleManager.instance;
  }
}
