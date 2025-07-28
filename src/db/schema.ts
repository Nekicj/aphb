// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  index,
  integer,
  pgTableCreator,
  serial,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `aphb_${name}`);

export const teams = createTable(
  "team",
  {
    id: serial("id").primaryKey(),
    team: varchar("name", { length: 256 }).notNull().unique(),
    league: varchar("league", { length: 50 }).notNull(),
    language: varchar("language", { length: 50 }).notNull(),
    leaderName: varchar("leader_name", { length: 256 }).notNull(),
    leaderEmail: varchar("leader_email", { length: 256 }).notNull(),
    leaderPhone: varchar("leader_phone", { length: 50 }).notNull(),
    captainName: varchar("captain_name", { length: 256 }).notNull(),
    captainSchool: varchar("captain_school", { length: 256 }).notNull(),
    captainGrade: integer("captain_grade").notNull(),
    captainEmail: varchar("captain_email", { length: 256 }).notNull().unique(),
    captainPhone: varchar("captain_phone", { length: 50 }).notNull(),
    member1Name: varchar("member1_name", { length: 256 }).notNull(),
    member1School: varchar("member1_school", { length: 256 }).notNull(),
    member1Grade: integer("member1_grade").notNull(),
    member1Email: varchar("member1_email", { length: 256 }).notNull(),
    member1Phone: varchar("member1_phone", { length: 50 }).notNull(),
    member2Name: varchar("member2_name", { length: 256 }).notNull(),
    member2School: varchar("member2_school", { length: 256 }).notNull(),
    member2Grade: integer("member2_grade").notNull(),
    member2Email: varchar("member2_email", { length: 256 }).notNull(),
    member2Phone: varchar("member2_phone", { length: 50 }).notNull(),
    member3Name: varchar("member3_name", { length: 256 }),
    member3School: varchar("member3_school", { length: 256 }),
    member3Grade: integer("member3_grade"),
    member3Email: varchar("member3_email", { length: 256 }),
    member3Phone: varchar("member3_phone", { length: 50 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (example) => ({
    name: index("team_idx").on(example.team),
  })
);
