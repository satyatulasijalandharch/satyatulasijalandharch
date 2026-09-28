import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob, file } from "astro/loaders";

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
      cover: image().optional(),
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
      updatedDate: z.coerce.date().optional(),
      topic: z.string(),
      readTime: z.string().default("5 min"),
      draft: z.boolean().default(false),
      cover: image().optional(),
    }),
});

const certs = defineCollection({
  loader: file("src/content/certs/certs.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    issuer: z.string(),
    issueDate: z.string(),
    validUntil: z.string().optional(),
    credentialUrl: z.url(),
    skills: z.array(z.string()).optional(),
  }),
});

const experience = defineCollection({
  loader: file("src/content/experience/experience.json"),
  schema: z.object({
    id: z.string(),
    period: z.string(),
    role: z.string(),
    company: z.string(),
    location: z.string().optional(),
    focus: z.string(),
    stack: z.array(z.string()),
    highlights: z.array(z.string()).optional(),
    order: z.number().default(0),
  }),
});

export const collections = { work, blog, certs, experience };
