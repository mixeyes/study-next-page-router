import { Users } from '../models/Users';
import { Categories } from '../models/Categories';
import categories from './categories.json';
import users from './users.json';
import { ICategories } from '@/interfaces/categories';

Users.getInstance().addTestUsers(users);
Categories.getInstance().addTestCategories(categories as ICategories)
