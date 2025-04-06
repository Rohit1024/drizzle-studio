import { drizzle } from "drizzle-orm/node-postgres";
import { seed } from "drizzle-seed";
import * as schema from './src/schema';

async function main() {
  const db = drizzle(process.env.DATABASE_URL!, { schema });
  
  await seed(db, { 
    users: schema.users,
    posts: schema.posts,
    comments: schema.comments
  }).refine((f) => ({
    users: {
      columns: {
        name: f.fullName(),
        email: f.email(),
      },
      count: 20
    },
    posts: {
      count: 50
    },
    comments: {
      count: 200
    }
  }));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});