import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  out: './src/db/migrations',
  schema: './src/db/schema.ts',
  dbCredentials: {
    url: process.env.DB_URL!,
    ssl: false, // Explicitly disable SSL (Should be true in production)
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
});
