import { Users } from '../models/Users';
import { Categories } from '../models/Categories';
import { addPgCrypto } from './addCrypto';
import { createDatabase } from './createDb';

const createDB = async () => {
  await createDatabase();
  await Users.getInstance().createUserTable();
  await Categories.getInstance().createCategoriesTable();
  await addPgCrypto();
};
createDB()
  .then(() => console.log('All tables was created!'))
  .finally(() => {
    console.log('all tasks were finished');
    process.exit();
  });
