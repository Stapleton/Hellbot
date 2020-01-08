import * as DJS from 'discord.js';
import * as MDB from 'mongodb';
import { MongoDB as MongoDBService, COLLECTIONS } from '../../services/MongoDB';
import { Musicbot } from '../Musicbot';
import { Lib } from '../../lib/Lib';

const MongoDB = MongoDBService.getInstance();

export class Delete {
  private LOGGER = Musicbot.getLogger();
  private coll: MDB.Collection; // musicbot db collection

  constructor(Message: DJS.Message) {
    if (Lib.checkForVC(Message) == false) return;

    this.coll = MongoDB.getCollection(Message.guild.id, COLLECTIONS.Musicbot);
    let id = Number(Message.content.split(' ')[1]);

    this.coll.deleteOne({ ID: id })
    .then(() => this.handleSuccess(id, Message))
    .catch(error => this.handleError(error, Message));
  }

  private handleSuccess(SongID: number, Message: DJS.Message) {
    Message.channel.send(`Removed song`);
  }

  private handleError(Error: Error, Message: DJS.Message) {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.LOGGER.error(Error);
  }
}
