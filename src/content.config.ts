import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const work = defineCollection({
  loader: glob({
    base: "./src/content/work",
    pattern: ["*.md", "**/*.md"],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      period: z.string(),
      company: z.string(),
      role: z.string(),
      metric: z.string(),
      stack: z.array(z.string()),
      featured: z.boolean().default(false),
      order: z.number().default(0),
      cover: image().nullish(),
    }),
});

const blog = defineCollection({
  loader: glob({
    base: "./src/content/blog",
    pattern: ["*.md", "**/*.md"],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().nullish(),
      topic: z.string(),
      readTime: z.string().default("5 min"),
      draft: z.boolean().default(false),
      cover: image().nullish(),
    }),
});

const certs = defineCollection({
  loader: glob({ base: "./src/content/certs", pattern: "*.json" }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    issuer: z.string(),
    issueDate: z.string(),
    validUntil: z.string().nullish(),
    credentialUrl: z.url(),
    skills: z.array(z.string()).optional(),
    order: z.number().default(0),
  }),
});

const experience = defineCollection({
  loader: glob({ base: "./src/content/experience", pattern: "*.json" }),
  schema: z.object({
    id: z.string(),
    period: z.string(),
    role: z.string(),
    company: z.string(),
    location: z.string().nullish(),
    focus: z.string(),
    stack: z.array(z.string()),
    highlights: z.array(z.string()).optional(),
    order: z.number().default(0),
  }),
});

export const collections = { work, blog, certs, experience };
