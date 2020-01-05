import { Logger } from './Logger';
import * as MDB from 'mongodb';

class MongoDB extends MDB.MongoClient {

  private Logger: Logger = new Logger('MongoDB');

  constructor() {
    super(process.env.MONGODB, { 
      authSource: "admin", 
      auth: {
        user: process.env.MONGODB_USER, 
        password: process.env.MONGODB_PASS 
      }, 
      appname: "Alloybot", 
      useNewUrlParser: true,
      forceServerObjectId: true }
    );
    
    this.connect().then(() => {

    })
    
  }
}
