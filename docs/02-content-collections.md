# 02 - Content Collections

This document outlines the Astro Content Layer architecture in `src/content.config.ts`, detailing the schemas, loaders, and querying strategies used across the project.

## Architecture & Loaders

Astro 7 uses the Content Layer API. Collections are configured in `src/content.config.ts` using two primary loaders:

1. `glob()`: Automatically discovers and parses Markdown files from subdirectories.
2. `file()`: Reads and validates structured records from individual JSON files.

```
src/content/
├── blog/             # glob() -> Markdown articles
│   ├── designing-event-driven-cloud-systems.md
│   └── why-task-rightsizing-beats-savings-plans.md
├── certs/            # file() -> certs.json
│   └── certs.json
├── experience/       # file() -> experience.json
│   └── experience.json
└── work/             # glob() -> Markdown case studies
    ├── finops-optimization-engine.md
    └── multi-region-delivery-pipeline.md
```

---

## Collection Schemas

### 1. `work` Collection

Used for engineering case studies and portfolio project highlights.

- **Loader**: `glob({ base: "./src/content/work", pattern: ["*.md", "**/*.md"] })`
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
  cover: image().optional(),
});
```

**Key Fields**:

- `metric`: Decisive business or technical KPI (e.g., `"-$140k/yr"` or `"4-region"`).
- `featured`: Controls presence on the homepage.
- `order`: Numeric sort order (ascending).

---

### 2. `blog` Collection

Technical articles and engineering writing.

- **Loader**: `glob({ base: "./src/content/blog", pattern: ["*.md", "**/*.md"] })`
- **Schema**:

```typescript
z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  topic: z.string(),
  readTime: z.string().default("5 min"),
  draft: z.boolean().default(false),
  cover: image().optional(),
});
```

**Key Fields**:

- `pubDate`: Automatically coerced to a JavaScript `Date` object.
- `topic`: Primary classification badge (e.g., `"Cloud Architecture"`, `"FinOps"`).
- `draft`: When `true`, excluded from indexes, detail pages, and the RSS feed.

---

### 3. `certs` Collection

Industry credentials and professional certifications.

- **Loader**: `file("src/content/certs/certs.json")`
- **Schema**:

```typescript
z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  issueDate: z.string(),
  validUntil: z.string().optional(),
  credentialUrl: z.string().url(),
  skills: z.array(z.string()).optional(),
});
```

**Key Fields**:

- `credentialUrl`: Validated as a fully qualified URL for external credential verification.
- `skills`: Associated tags displayed as badges alongside the credential.

---

### 4. `experience` Collection

Chronological career history and professional experience.

- **Loader**: `file("src/content/experience/experience.json")`
- **Schema**:

```typescript
z.object({
  id: z.string(),
  period: z.string(),
  role: z.string(),
  company: z.string(),
  location: z.string().optional(),
  focus: z.string(),
  stack: z.array(z.string()),
  highlights: z.array(z.string()).optional(),
  order: z.number().default(0),
});
```

**Key Fields**:

- `focus`: Executive summary of core responsibilities and mission.
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
