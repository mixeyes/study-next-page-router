import { monitoredMethod } from '@/utils';
import { DBConnector } from '../dbConnector';

export class Users {
  private static _instance: Users = new Users();
  private connector: DBConnector;

  constructor() {
    if (Users._instance) {
      throw new Error(
        'Error: Instantiation failed: Use Categories.getInstance() instead of new.'
      );
    }
    this.connector = DBConnector.getInstance();
    Users._instance = this;
  }

  public static getInstance(): Users {
    return Users._instance;
  }

  @monitoredMethod
  async addTestUsers(testUsers: any) {

    testUsers.forEach(async (user) => {
      const query = `INSERT INTO public.users(
      last_name, first_name, email, create_date, update_date, username, password, role)
      VALUES ('${user.last_name}',
        '${user.first_name}',
        '${user.email}',
        '${new Date().toLocaleDateString()}',
        '${new Date().toLocaleDateString()}',
        '${user.username}',
        crypt('${user.password}', gen_salt('bf')),
        '${user.role}');`;
      const result = await this.connector.execute(query);
      if (result) {
        console.log(`${user.username} added`);
      }
    });
    console.log('All users added');
  }

  @monitoredMethod
  async createUserTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS "users" (
	    "id" SERIAL,
	    "last_name" VARCHAR(100) NOT NULL,
	    "first_name" VARCHAR(100) NOT NULL,
	    "email" VARCHAR(100) NOT NULL UNIQUE,
      "create_date" DATE NOT NULL DEFAULT CURRENT_DATE,
      "update_date" DATE NOT NULL DEFAULT CURRENT_DATE,
	    "username" VARCHAR(100) NOT NULL UNIQUE,
      "password" TEXT NOT NULL,
	    "role" VARCHAR(15) NOT NULL,
	    PRIMARY KEY ("id")
    );`;

    const result = await this.connector.execute(query);
    if (result) {
      console.log('Table users created');
    }
    console.log('the end user');
  }
}
