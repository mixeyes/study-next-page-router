import Pool from 'pg-pool';
import dotenv from 'dotenv';
import { PoolClient } from 'pg';

dotenv.config();

export const createDatabase = async () => {
  const pool = await new Pool({
    user: process.env['PGSQL_USER'],
    host: process.env['PGSQL_HOST'],
    database: 'postgres',
    password: process.env['PGSQL_PASSWORD'],
    port: process.env['PGSQL_PORT'] ? +process.env['PGSQL_PORT'] : undefined,
  });

  const checkDBExist = async () => {
    let client: PoolClient;
    try {
      client = await pool.connect(); // gets connection
      const list = await client.query(
        `SELECT * FROM pg_database  WHERE datname = 'next_app';`
      ); // sends queries
      return !!list.rowCount;
    } catch (error: any) {
      console.error(error.stack);
      return false;
    }
  };

  const createDB = async () => {
    let client: PoolClient;
    try {
      const isExist = await checkDBExist();
      if (!isExist) {
        client = await pool.connect(); // gets connection
        await client.query(`CREATE DATABASE next_app`); // sends queries
        console.log('Database created');
      } else {
        console.log('DB next-app already exist');
      }
      return true;
    } catch (error: any) {
      console.error(error.stack);
      return false;
    }
  };
  await createDB()
};
