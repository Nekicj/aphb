import { defineCollection, z } from "astro:content";

const table = z.array(
  z.object({
    place: z.enum(["GP", "HM", "1", "2", "3"]).optional(),
    team: z.string(),
    photo: z.string().optional(),
    schools: z.array(z.string()),
    captain: z.string(),
    members: z.array(z.string()),
  })
);

const resultsCollection = defineCollection({
  type: "data",
  schema: z.object({
    year: z.number(),
    senior: table,
    junior: table,
  }),
});

const teamCollection = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    position: z.string(),
    achievements: z.array(z.string()),
    name_en: z.string().optional(),
    name_kz: z.string().optional(),
    position_en: z.string().optional(),
    position_kz: z.string().optional(),
    achievements_en: z.array(z.string()).optional(),
    achievements_kz: z.array(z.string()).optional(),
  }),
});

export const collections = {
  results: resultsCollection,
  team: teamCollection,
};
