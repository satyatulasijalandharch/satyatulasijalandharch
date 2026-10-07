# 02 - Content Collections

This document outlines the Astro Content Layer architecture in `src/content.config.ts`, detailing the schemas, loaders, and querying strategies used across the project.

## Architecture & Loaders

Astro 7 uses the Content Layer API. Collections are configured in `src/content.config.ts` with `glob()` for each entry file. Astro's `file()` loader remains useful for single-file data, but this project no longer uses it for its collections.

`glob()` discovers Markdoc and JSON entries. Each certification and experience record lives in its own JSON file.

```
src/content/
├── blog/             # glob() -> Markdoc (.mdoc) articles
│   ├── designing-event-driven-cloud-systems.mdoc
│   └── why-task-rightsizing-beats-savings-plans.mdoc
├── certs/            # glob() -> one JSON file per certification
│   ├── oci-foundations-associate.json
│   ├── github-foundations.json
│   └── atlassian-devops-essentials.json
├── experience/       # glob() -> one JSON file per role
│   ├── marumitra-cloud-engineer.json
│   ├── codecafe-devops-engineer.json
│   └── tezhire-devops-engineer.json
├── work/             # glob() -> Markdoc (.mdoc) case studies
│   ├── finops-optimization-engine.mdoc
│   └── multi-region-delivery-pipeline.mdoc
└── skills.json       # Keystatic Singleton -> centralized technical skills ledger
```

## Local Authoring with Keystatic

Keystatic manages all four collections and the skills singleton through the local Admin UI. Run `npm run dev`, then open `http://localhost:4321/keystatic`. The development config registers Keystatic only for the dev command. Astro runs on Node.js locally, which Keystatic needs for filesystem storage. Production builds do not register the Admin route.

Blog and work entries stay as `.mdoc` files with frontmatter and Markdoc bodies. Certification and experience entries are individual JSON files. Skills are centralized in `src/content/skills.json` as a Keystatic Singleton, feeding searchable `fields.multiselect` inputs across `certs`, `experience`, and `work`.

Keystatic saves content directly into the repository. Review and commit those content changes as usual; the existing deployment workflow publishes committed content. Cover images uploaded in the Admin UI go under `src/assets/images/content`.

---

## Collection Schemas

### 1. `work` Collection

Used for engineering case studies and portfolio project highlights.

- **Loader**: `glob({ base: "./src/content/work", pattern: ["*.{md,mdoc}", "**/*.{md,mdoc}"] })`
- **Schema**:

```typescript
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
});
```

**Key Fields**:

- `metric`: Decisive business or technical KPI (e.g., `"-$140k/yr"` or `"4-region"`).
- `featured`: Controls presence on the homepage.
- `order`: Numeric sort order (ascending).

---

### 2. `blog` Collection

Technical articles and engineering writing.

- **Loader**: `glob({ base: "./src/content/blog", pattern: ["*.{md,mdoc}", "**/*.{md,mdoc}"] })`
- **Schema**:

```typescript
z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().nullish(),
  topic: z.string(),
  readTime: z.string().default("5 min"),
  draft: z.boolean().default(false),
  cover: image().nullish(),
});
```

**Key Fields**:

- `pubDate`: Automatically coerced to a JavaScript `Date` object.
- `topic`: Primary classification badge (e.g., `"Cloud Architecture"`, `"FinOps"`).
- `draft`: When `true`, excluded from indexes, detail pages, and the RSS feed.

---

### 3. `certs` Collection

Industry credentials and professional certifications.

- **Loader**: `glob({ base: "./src/content/certs", pattern: "*.json" })`
- **Schema**:

```typescript
z.object({
  name: z.string(),
  issuer: z.string(),
  issueDate: z.string(),
  validUntil: z.string().nullish(),
  credentialUrl: z.string().url(),
  skills: z.array(z.string()).optional(),
  order: z.number().default(0),
});
```

**Key Fields**:

- `credentialUrl`: Validated as a fully qualified URL for external credential verification.
- `skills`: Associated tags selected from the centralized skills ledger.
- `order`: Explicit order for the homepage summary.

---

### 4. `experience` Collection

Chronological career history and professional experience.

- **Loader**: `glob({ base: "./src/content/experience", pattern: "*.json" })`
- **Schema**:

```typescript
z.object({
  period: z.string(),
  role: z.string(),
  company: z.string(),
  location: z.string().nullish(),
  focus: z.string(),
  stack: z.array(z.string()),
  highlights: z.array(z.string()).optional(),
  order: z.number().default(0),
});
```

**Key Fields**:

- `focus`: Executive summary of core responsibilities and mission.
- `stack`: Associated tech stack items selected from the centralized skills ledger.
- `highlights`: Granular bullet points of measurable accomplishments.

---

## Querying Collections

Use Astro's `getCollection` API with filtering and sorting:

### Querying Featured Work

```typescript
import { getCollection } from "astro:content";

const featuredWork = (
  await getCollection("work", ({ data }) => data.featured)
).sort((a, b) => a.data.order - b.data.order);
```

### Querying Published Blog Posts

```typescript
import { getCollection } from "astro:content";

const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
);
```

### Querying Experience

```typescript
import { getCollection } from "astro:content";

const experience = (await getCollection("experience")).sort(
  (a, b) => a.data.order - b.data.order,
);
```

---

## Rendering Markdown Content

Markdown entries in the `work` and `blog` collections are rendered using Astro's `render()` function:

```astro
---
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { id: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<article class="prose">
  <Content />
</article>
```

---

## Next Steps

- Proceed to [03 - Routing and Pages](./03-routing-and-pages.md) to see how collections map to URL routes.
- Proceed to [04 - Components and UI](./04-components-and-ui.md) to inspect rendering components.
