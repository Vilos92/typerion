import {migrate} from 'drizzle-orm/postgres-js/migrator';

import {db, sql} from '../db/db';

(async () => {
  await migrate(db, {migrationsFolder: 'db/migrations'});
  await sql.end();
})().catch(console.error);
