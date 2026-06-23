import { type Config } from "drizzle-kit";

import * as dotenv from 'dotenv';
// @ts-ignore
dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required and must be a filled string in .env.local.");
}

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: DATABASE_URL,
  },
} satisfies Config;
