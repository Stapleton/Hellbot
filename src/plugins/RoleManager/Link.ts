import * as DJS from 'discord.js';
import * as MDB from 'mongodb';
import { RoleManager } from '@Plugins/RoleManager';
import { MongoDB as MongoDBService, COLLECTIONS } from '@Services/MongoDB';
import { Lib } from '@Lib/Lib';

const MongoDB = MongoDBService.getInstance();

export class Link {
  private LOGGER = RoleManager.getLogger();
  private coll: MDB.Collection;

  constructor(Message: DJS.Message) {
    let allowed = Lib.checkForPerms(Message, "MANAGE_ROLES");
    if (!allowed) return;

    this.coll = MongoDB.getCollection(Message.guild.id, COLLECTIONS.RoleManager);

    let split = Message.content.split(' ');
    let args = {
      role: split[1],
      emote: split[2]
    }
    
    this.coll.insertOne(args)
    .then(value => { 
      this.handleSuccess(Message, value);
    }).catch(error => {
      this.handleError(error, Message);
    });
  }

  private handleSuccess<T>(Message: DJS.Message, Success: MDB.InsertOneWriteOpResult<T>) {
    Message.channel.send(`*Mmmmm. Yeaahhhh*`);
  }

  private handleError(Error: Error, Message: DJS.Message) {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.LOGGER.error(Error);
  }
}
