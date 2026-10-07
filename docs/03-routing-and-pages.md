# 03 - Routing and Pages

This document details all routes, pages, static generation mechanisms, and endpoint handlers in `src/pages/`.

## Route Table

| File Path                    | Route URL      | Page Type          | Content Queried                                     |
| :--------------------------- | :------------- | :----------------- | :-------------------------------------------------- |
| `src/pages/index.astro`      | `/`            | Static             | `work`, `blog`, `certs`, `experience`               |
| `src/pages/about.astro`      | `/about`       | Static             | Structured competencies, academics, publication     |
| `src/pages/certs.astro`      | `/certs`       | Static             | `certs` collection                                  |
| `src/pages/blog/index.astro` | `/blog`        | Static             | `blog` collection (non-draft)                       |
| `src/pages/blog/[id].astro`  | `/blog/[id]`   | Dynamic Static     | Single `blog` entry rendered via `render()`         |
| `src/pages/work/index.astro` | `/work`        | Static             | `work` collection                                   |
| `src/pages/work/[id].astro`  | `/work/[id]`   | Dynamic Static     | Single `work` entry rendered via `render()`         |
| `src/pages/404.astro`        | `/404`         | Static             | None (`noindex={true}`)                             |
| `src/pages/rss.xml.ts`       | `/rss.xml`     | API / XML Endpoint | `blog` collection                                   |
| `@astrojs/sitemap`           | `/sitemap-index.xml` | Build Integration | Static routes, published `blog`, and `work` entries |

---

## Detailed Page Breakdown

### 1. Homepage (`/`) — `src/pages/index.astro`

Assembles the primary presentation of the site:

- Fetches featured projects, recent 3 blog posts, top 2 credentials, and experience timeline.
- Composes sections: `HeroSection`, `ImpactMetrics`, `FeaturedWork`, `ExperienceSection`, `RecentPosts`, and `CertsSummary`.

### 2. About Page (`/about`) — `src/pages/about.astro`

Provides technical background and credibility markers:

- **Portrait & Bio**: In-depth personal narrative with location status.
- **Competencies Grid**: 4 `SkillCard` components covering Cloud Architecture, Infrastructure as Code, CI/CD, and Observability/Governance.
- **Academic Credentials**: Bachelor of Technology in Computer Science rendered via `AcademicRow`.
- **Publications**: Research paper citation and external link using `AcademicRow`.
- **Engineering Philosophy**: Principles for building reliable distributed systems.

### 3. Certifications Page (`/certs`) — `src/pages/certs.astro`

Presents a responsive credential ledger, ordered by issue date with newest first:

- Queries all entries in `certs` collection.
- Renders each credential through `CertCard`.
- Desktop rows align issue date, credential and competencies, issuer, and verification link.
- Mobile rows stack credential details and place issue date beside the verification link.

### 4. Blog Index (`/blog`) — `src/pages/blog/index.astro`

Tabular listing of technical writing:

- Filters out entries where `draft: true`.
- Sorts posts by `pubDate` descending.
- Shows publication date in tabular figures, post title, topic badge, and reading time estimate.

### 5. Blog Dynamic Routes (`/blog/[id]`) — `src/pages/blog/[id].astro`

- Implements `getStaticPaths()`:
  ```typescript
  export async function getStaticPaths() {
    const posts = await getCollection("blog", ({ data }) => !data.draft);
    return posts.map((post) => ({
      params: { id: post.id },
      props: { post },
    }));
  }
  ```
- Renders Markdown content with `await render(post)`.
- Includes back-to-index navigation, header metadata, reading time, and formatted publish/update dates.
- Sends article-specific Open Graph publication metadata and `BlogPosting` JSON-LD from the same collection fields.

### 6. Work Index (`/work`) — `src/pages/work/index.astro`

Showcases engineering case studies:

- Queries all entries from `work` collection sorted by `order`.
- Displays items in a 2-column responsive grid using `ProjectCard`.

### 7. Work Dynamic Routes (`/work/[id]`) — `src/pages/work/[id].astro`

- Implements `getStaticPaths()` querying the `work` collection.
- Renders full case study Markdown using `await render(entry)`.
- Displays metadata pill tags: Company, Role, Key Metric, and Tech Stack badges.

### 8. Custom 404 (`/404`) — `src/pages/404.astro`

- Supplies `noindex={true}` to `BaseLayout` to avoid search indexing.
- Features clean error typography and a direct button returning to `/`.

---

## Feed and Sitemap Endpoints

### RSS Feed (`src/pages/rss.xml.ts`)

Generates an RSS 2.0 XML feed using `@astrojs/rss`:

```typescript
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const sorted = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return rss({
    title: "Satya Tulasi Jalandhar C H - Cloud & DevOps Engineer",
    description:
      "Writing on cloud architecture, IaC, Kubernetes, and platform reliability.",
    site: context.site ?? context.url,
    trailingSlash: false,
    items: sorted.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}`,
    })),
  });
}
```

### Sitemap (`@astrojs/sitemap`)

Generates standard sitemap index and sub-sitemaps automatically during `astro build`. `public/robots.txt` points to `/sitemap-index.xml`.

The integration discovers all prerendered static routes (filtering out internal CMS routes like `/keystatic`) and generates fully canonical URLs anchored to `https://stjch.in`.

---

## Next Steps

- Proceed to [04 - Components and UI](./04-components-and-ui.md) for UI building blocks.
- Proceed to [05 - Styling and Theming](./05-styling-and-theming.md) for theme switching architecture.
