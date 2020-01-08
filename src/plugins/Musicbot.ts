import { Discord as DiscordService } from '../services/Discord';
import * as Lang from '../lib/Lang';

import { Signale } from 'signale';

import { Join } from './Musicbot/Join';
import { Leave } from './Musicbot/Leave';
import { Add } from './Musicbot/Add';
import { Play } from './Musicbot/Play'
import { Stop } from './Musicbot/Stop'
import { Pause } from './Musicbot/Pause'
import { Resume } from './Musicbot/Resume'
import { Volume } from './Musicbot/Volume'
import { Delete } from './Musicbot/Delete'

export class Musicbot {
  private static instance: Musicbot;

  protected static LOGGER = new Signale({
    scope: Musicbot.name
  });
  
  private constructor() {
    Musicbot.LOGGER.success(`${Lang.INIT_PLUGIN} ${Musicbot.name}`);

    let Discord = DiscordService.getInstance();

    Discord.on('message', MessageEvent => {
      let split = MessageEvent.content.split(' ');
      let args = {
        token: split[0],
        search: split[1]
      }

      switch (args.token) {
        case '.join':
          new Join(MessageEvent);
          break;
        
        case '.leave':
          new Leave(MessageEvent);
          break;

        case '.add':
          new Add(MessageEvent);
          break;

        case '.play':
          if (typeof args.search != 'undefined') {
            new Add(MessageEvent, false, true);
          } else {
            new Play(MessageEvent);
          }
          break;

        case '.stop':
          new Stop(MessageEvent);
          break;

        case '.pause':
          new Pause(MessageEvent);
          break;

        case '.resume':
          new Resume(MessageEvent);
          break;

        case '.skip':
          new Stop(MessageEvent);
          new Play(MessageEvent);
          break;

        case '.volume':
          new Volume(MessageEvent);
          break;

        case '.del':
          new Delete(MessageEvent);
          break;
      }
    });
  }

  public static getInstance(): Musicbot {
    if (!Musicbot.instance) {
      Musicbot.instance = new Musicbot();
    }

    return Musicbot.instance;
  }

  public static getLogger(): Signale {
    return Musicbot.LOGGER;
  }
}
