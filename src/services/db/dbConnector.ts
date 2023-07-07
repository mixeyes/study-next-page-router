import { Client, PoolClient, PoolConfig } from 'pg';
import dotenv from 'dotenv';
import Pool from 'pg-pool';
import { monitoredMethod } from '@/utils';

dotenv.config();

export class DBConnector {
  private static _instance: DBConnector = new DBConnector();
  private _pool: Pool<Client>;

  constructor() {
    if (DBConnector._instance) {
      throw new Error(
        'Error: Instantiation failed: Use DBConnector.getInstance() instead of new.'
      );
    }
    const port = process?.env?.PGSQL_PORT
      ? +process?.env?.PGSQL_PORT
      : undefined;
    const config: PoolConfig = {
      user: process.env['PGSQL_USER'],
      host: process.env['PGSQL_HOST'],
      database: process.env['PGSQL_DATABASE'],
      password: process.env['PGSQL_PASSWORD'],
      port,
    };
    this._pool = new Pool(config);
    DBConnector._instance = this;
  }

  public static getInstance(): DBConnector {
    return DBConnector._instance;
  }

  @monitoredMethod
  public async execute(query: string, values?: string[]) {
    let client:PoolClient | null = null;
    try {
      client = await this._pool.connect();
      const res = await client.query(query, values);
      return res.rows;
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      client?.release(true);
    }
  }
}
