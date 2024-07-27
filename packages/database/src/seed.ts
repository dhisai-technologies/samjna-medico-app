import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import { users } from "./schema";

dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DB_URL,
  ssl: false,
});

const db = drizzle(client);

async function main() {
  await client.connect();
  console.log("📦 connected to user database");
  await db.insert(users).values({
    email: "samjnaanalytics@gmail.com",
    name: "Anjana Admin",
    role: "ADMIN",
  });
  await db.insert(users).values({
    email: "nsvegur01@gmail.com",
    name: "Nagasai Vegur",
    role: "ADMIN",
  });
  console.log("Created ADMIN");
  process.exit(0);
}

main();
