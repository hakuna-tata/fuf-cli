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

  find(colName){
    return new Promise((resolve, reject) => {
        this.connect().then(db => {
            const result = db.collection(colName).find({});
            result.toArray((err,data) => {
              if(err) reject(err);

              resolve(data);
            });
        });
    });
  }

}

module.exports = DB.getInstance();
