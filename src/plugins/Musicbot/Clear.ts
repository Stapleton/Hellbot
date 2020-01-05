import * as DJS from 'discord.js';
import * as MDB from 'mongodb';
import { MongoDB as MongoDBService } from '../../services/MongoDB';
import { Musicbot } from '../Musicbot';

const MongoDB = MongoDBService.getInstance();

export class Clear {
  private LOGGER = Musicbot.getLogger();
  private coll: MDB.Collection; // musicbot db collection

  constructor(Message: DJS.Message) {
    this.coll = MongoDB.getCollection(Message.guild.id, 'musicbot');

    try {
      this.handleSuccess(Message, this.coll.find());
    } catch (error) {
      this.handleError(error, Message);
    }
  }

  private handleSuccess(Message: DJS.Message, Cursor: MDB.Cursor) {
    // TODO: Finish Queue Clear Command
  }

  private handleError(Error: Error, Message: DJS.Message) {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.LOGGER.error(Error);
  }
}
