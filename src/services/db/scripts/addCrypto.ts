import { DBConnector } from '../dbConnector';

export const addPgCrypto = async () => {
  const connector = DBConnector.getInstance();
  const query = 'CREATE EXTENSION pgcrypto';

  const result = await connector.execute(query);
  if (result) {
    console.log('pgcrypto added');
  }
  console.log('the end pgcrypto');
};
