import ytdlrun = require('ytdl-run');
import * as DJS from 'discord.js';
import * as MDB from 'mongodb';
import { Discord as DiscordService } from '../../services/Discord';
import { MongoDB as MongoDBService, COLLECTIONS } from '../../services/MongoDB';
import { Musicbot } from '../Musicbot';
import { SongEmbed as Embed } from './Embed';
import { Join } from './Join';
import { Lib } from '../../lib/Lib';

const MongoDB = MongoDBService.getInstance();

// TODO: Be more expressive on whether or not the command worked
// TODO: Make the command more reliable when its in a voice channel
// TODO: Links arent reliable
export class Play {
  private LOGGER = Musicbot.getLogger();
  private coll;

  constructor(Message: DJS.Message) {
    if (Lib.checkForVC(Message) == false) return;

    this.coll = MongoDB.getCollection(Message.guild.id, COLLECTIONS.Musicbot);
    if (!Message.guild.voiceConnection) new Join(Message);

    this.coll.findOneAndDelete({ Playing: false })
    .then(result => this.handleSuccess(result, Message))
    .catch(error => this.handleError(error, Message));
  }

  private handleSuccess(Result: MDB.FindAndModifyWriteOpResultObject, Message: DJS.Message) {
    if (Result.value == null) {
      Message.channel.send(`End of Queue`);
      return;
    }
    //if (Result.value == null) Message.channel.send(`Something went wrong. \`Play.ts#handleSuccess // Result.value == null\``)
    //if (Result.ok != 1) Message.channel.send(`Something went wrong. \`Play.ts#handleSuccess // Result.ok != 1\``);

    const Stream = ytdlrun.stream(Result.value.URL).stdout;

    Message.guild.voiceConnection.playStream(Stream, { passes: 1, volume: 0.3, bitrate: "auto" });
    Message.guild.voiceConnection.dispatcher.once('end', () => {
      new Play(Message);
    });
    
    new Embed(Message, Result.value, 'Playing');
  }

  private handleError(Error: MDB.MongoError, Message: DJS.Message) {
    Message.channel.send(`Something went wrong. \`${Error.message}\``);
    this.LOGGER.error(Error);
  }
}
