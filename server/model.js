const { MongoClient } = require('mongodb');

const DBCONFIG = {
  ip: '127.0.0.1',
  port: '27017',
  db: 'fuf-cli-config',
};

class DB {
  static getInstance () {
    if(!DB.instance){
      DB.instance = new DB();
    }

    return DB.instance;
  }

  constructor() {
    this.db = null;
    this.connect();
  }

  connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(`mongodb://${DBCONFIG.ip}:${DBCONFIG.port}/`, (err, client) => {
        if(err) reject(err);

        this.db = client.db(DBCONFIG.db);
        resolve(this.db);
      });
    });
  }

  async find(colName){
    const list = await this.db.collection(colName).find({}).project({ _id: 0 }).toArray();

    return list;
  }

}

module.exports = DB.getInstance();
