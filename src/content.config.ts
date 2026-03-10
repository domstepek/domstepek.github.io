import { defineCollection, z } from "astro:content";

const notes = defineCollection({
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { notes };
