import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from 'drizzle-orm/node-postgres/migrator';

const main = async () => {
    const db = drizzle(process.env.DATABASE_URL!);
    try {
      await migrate(db, { migrationsFolder: './drizzle' });
      console.log('Migration complete');
    } catch (error) {
      console.log(error);
    }
    process.exit(0);
  };
  main();
