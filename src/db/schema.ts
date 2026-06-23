// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  boolean,
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
export const createTable = pgTableCreator((name) => `nchb_${name}`);

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
    captainParentName: varchar("captain_parent_name", { length: 256 }).notNull(),
    captainParentEmail: varchar("captain_parent_email", { length: 256 }).notNull(),
    captainParentPhone: varchar("captain_parent_phone", { length: 50 }).notNull(),
    captainAutoproctorConsent: boolean("captain_autoproctor_consent").notNull(),
    member1ParentName: varchar("member1_parent_name", { length: 256 }).notNull(),
    member1ParentEmail: varchar("member1_parent_email", { length: 256 }).notNull(),
    member1ParentPhone: varchar("member1_parent_phone", { length: 50 }).notNull(),
    member1AutoproctorConsent: boolean("member1_autoproctor_consent").notNull(),
    member2ParentName: varchar("member2_parent_name", { length: 256 }).notNull(),
    member2ParentEmail: varchar("member2_parent_email", { length: 256 }).notNull(),
    member2ParentPhone: varchar("member2_parent_phone", { length: 50 }).notNull(),
    member2AutoproctorConsent: boolean("member2_autoproctor_consent").notNull(),
    member3ParentName: varchar("member3_parent_name", { length: 256 }),
    member3ParentEmail: varchar("member3_parent_email", { length: 256 }),
    member3ParentPhone: varchar("member3_parent_phone", { length: 50 }),
    member3AutoproctorConsent: boolean("member3_autoproctor_consent"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (example) => ({
    name: index("team_idx").on(example.team),
  })
);


export const parentConsents = createTable(
  "parent_consent",
  {
    id: serial("id").primaryKey(),

    childIdentifier: varchar("child_identifier", { length: 256 }).notNull(),

    parentName: varchar("parent_name", { length: 256 }).notNull(),
    parentEmail: varchar("parent_email", { length: 256 }).notNull(),
    parentPhone: varchar("parent_phone", { length: 50 }).notNull(),

    isRepresentative: boolean("is_representative").notNull().default(false),
    poaNumber: varchar("poa_number", { length: 256 }),

    lang: varchar("lang", { length: 10 }).notNull(),

    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    childIdentifierIdx: index("parent_consent_child_identifier_idx").on(t.childIdentifier),
  })
);