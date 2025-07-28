import { type Config } from "drizzle-kit";

import { loadEnv } from "vite";
// @ts-ignore
const { DATABASE_URL } = loadEnv(process.env.DATABASE_URL, process.cwd(), "");

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: DATABASE_URL,
  },
  tablesFilter: ["airdrop_*"],
} satisfies Config;
