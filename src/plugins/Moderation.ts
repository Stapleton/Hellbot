import { Discord as DiscordService } from '../services/Discord';
import { MongoDB as MongoDBService } from '../services/MongoDB';
import * as Lang from '../lib/Lang';

import { Signale } from 'signale';

export class Moderation {
  private static instance: Moderation;

  protected static LOGGER = new Signale({
    scope: Moderation.name
  });
  
  private constructor() {
    Moderation.LOGGER.success(`${Lang.INIT_PLUGIN} ${Moderation.name}`);
  }

  public static getInstance(): Moderation {
    if (!Moderation.instance) {
      Moderation.instance = new Moderation();
    }

    return Moderation.instance;
  }
}
