import { Db, MongoClient } from 'mongodb';
import { environment } from './environment';

export class DbSingleton {
  private static _instance: Db;

  public static async instance(): Promise<Db> {
    if (!this._instance) {
      console.log('not instance');
      this._instance = (await MongoClient.connect(environment.dbString)).db(environment.dbName);
    }
    return this._instance;
  }
}
