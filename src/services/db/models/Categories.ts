import { monitoredMethod } from '@/utils';
import { DBConnector } from '../dbConnector';
import * as categories from '@/interfaces/categories';

export class Categories {
  private static _instance: Categories = new Categories();
  private connector: DBConnector;

  constructor() {
    if (Categories._instance) {
      throw new Error(
        'Error: Instantiation failed: Use Categories.getInstance() instead of new.'
      );
    }
    this.connector = DBConnector.getInstance();
    Categories._instance = this;
  }

  public static getInstance(): Categories {
    return Categories._instance;
  }

  @monitoredMethod
  async createCategoriesTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS "categories" (
	    "id" SERIAL,
	    "name" VARCHAR(100) NOT NULL,
	    "path" VARCHAR(100) NOT NULL UNIQUE,
      "img_url" VARCHAR(100) NOT NULL,
	    PRIMARY KEY ("id")
    );`;

    const result = await this.connector.execute(query);
    if (result) {
      console.log('Table categories created');
    }
    console.log(' the end category');
  };

  @monitoredMethod
  async getAllCategories() {
    const query = `SELECT * FROM public.categories;`;
    const result = await this.connector.execute(query);
    if (!result) {
      throw new Error("Can't get categories");
    } else {
      const data = result.map((item) => ({ ...item, imgUrl: item['img_url'] }));
      return data;
    }
  }

  @monitoredMethod
  async getCategorByName(categoryName: string) {
    const query = `SELECT name, path, img_url FROM public.categories WHERE path='${categoryName}';`;
    const result = await this.connector.execute(query);
    if (!result) {
      throw new Error(`Can't get category with id=${categoryName}`);
    } else {
      const data = result.map((item) => ({ ...item, imgUrl: item['img_url'] }));
      return data;
    }
  }

  @monitoredMethod
  async addTestCategories(categories: categories.ICategories) {
    categories.forEach(async (category) => {
      const query = `INSERT INTO public.categories(
      name, path, img_url)
      VALUES ('${category.name}', '${category.path}', '${category.img_url}');`;
      const result = await this.connector.execute(query);
      if (result) {
        console.log(`category ${category.name} added`);
      }
    });
    console.log('all data added');
  }
}

// export { addTestCategories } from './addData';
// export { createCategoriesTable } from './createTable';
// export * from './getData';
