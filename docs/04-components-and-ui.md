# 04 - Components and UI

This document details all UI components, props interfaces, and structural layouts in `src/components/` and `src/layouts/`.

## Component Directory Hierarchy

```text
src/
├── layouts/
│   └── BaseLayout.astro      # Master document shell & metadata
└── components/
    ├── layout/               # Global navigation & frame components
    │   ├── Container.astro   # Max-width bounded wrapper
    │   ├── SiteHeader.astro  # Sticky navigation bar & theme controls
    │   └── SiteFooter.astro  # Contact links, social links, back-to-top
    ├── home/                 # Homepage section blocks
    │   ├── HeroSection.astro
    │   ├── ImpactMetrics.astro
    │   ├── MetricItem.astro
    │   ├── FeaturedWork.astro
    │   ├── ExperienceSection.astro
    │   ├── RecentPosts.astro
    │   └── CertsSummary.astro
    ├── about/                # Modular about page items
    │   ├── SkillCard.astro
    │   └── AcademicRow.astro
    ├── CertCard.astro        # Certification row card
    ├── Portrait.astro        # Image optimization component
    ├── ProjectCard.astro     # Work case study card
    ├── ResumeButton.astro    # Resume link button
    ├── ThemeProvider.astro   # FOUC prevention script
    └── ThemeToggle.astro     # Tri-state theme switcher button
```

---

## Shared Layout Shell

### `src/layouts/BaseLayout.astro`

The outer HTML document shell for every route on the site.

- **Props**:
  - `title: string` (Page title)
  - `description?: string` (Meta description)
  - `image?: string` (Open Graph social image)
  - `imageAlt?: string` (Social image alternative text)
  - `article?: boolean` (Sets `og:type` to article when true)
  - `publishedTime?: Date`, `modifiedTime?: Date`, `articleSection?: string` (Article metadata)
  - `jsonLd?: Record<string, unknown>` (Page-specific structured data)
  - `noindex?: boolean` (Adds `robots: noindex, nofollow`)
- **Key Responsibilities**:
  - Injects `ThemeProvider.astro` into `<head>` to prevent FOUC.
  - Generates canonical URL using `Astro.site` and `Astro.url.pathname`.
  - Emits Open Graph/Twitter metadata including image alt text and article dates where applicable.
  - Emits `WebSite` JSON-LD on every page, plus page-specific `ProfilePage`/`Person`, `BlogPosting`, or `CreativeWork` data when provided.
  - Provides RSS auto-discovery link: `<link rel="alternate" type="application/rss+xml" href="/rss.xml" />`.
  - Provides a keyboard skip link and visible focus outline; wraps page body in `SiteHeader`, `Container`, `<main>`, and `SiteFooter`.

---

## Layout Components (`src/components/layout/`)

### `Container.astro`

- **Purpose**: Restricts max content width to `max-w-5xl` (64rem / 1024px) with responsive horizontal padding (`px-4 sm:px-6 lg:px-8`).
- **Styling**: Adds hairline lateral borders (`border-x border-border/80`) to create a consistent vertical frame.

### `SiteHeader.astro`

- **Purpose**: Sticky header bar (`sticky top-0 z-50 bg-background/95 backdrop-blur-md`).
- **Features**:
  - Nav links: `/`, `/work`, `/blog`, `/certs`, `/about`.
  - Active route highlighting matches exact paths and slash-delimited descendants.
  - Desktop navigation stays inline. Mobile navigation opens as a vertical menu.
  - Mobile links remain visible when JavaScript is disabled; the processed Astro script enhances them with a compact toggle.
  - Theme toggle and resume action stay visible at every screen size.
  - Mobile menu supports Escape and closes after selecting a route.

### `SiteFooter.astro`

- **Purpose**: Site footer with email and external profiles.
- **Features**:
  - Email contact action (`mailto:`); no phone number is published on the site.
  - Social profiles: GitHub, LinkedIn, RSS link.
  - Interactive "Back to top" button with smooth window scrolling.

---

## Reusable Core Components

### `ThemeProvider.astro`

- **Purpose**: Zero-FOUC theme initialization script.
- **Mechanism**: Injects an inline `<script is:inline>` into `<head>`. Executes synchronously before HTML rendering begins. Evaluates `localStorage.getItem('theme')` or falls back to `window.matchMedia('(prefers-color-scheme: dark)')`. Applies `.dark` class and `data-theme` attribute to `document.documentElement`.

### `ThemeToggle.astro`

- **Purpose**: Accessible button allowing users to cycle theme states.
- **State Machine**: Cycles sequentially: `auto` -> `light` -> `dark` -> `auto`.
- **UI**: Renders 3 SVGs (Monitor for Auto, Sun for Light, Moon for Dark), switching active icon via CSS data-attribute selectors.

### `ProjectCard.astro`

- **Purpose**: Card component for engineering case studies.
- **Props**:
  - `entry: CollectionEntry<'work'>`
  - `index?: number` (0-padded index display, e.g., `01`)
- **UI Elements**: Company name, role, index counter, title, description, highlighted metric badge, technology stack pills, and link to `/work/[id]`.

### `CertCard.astro`

- **Purpose**: Responsive ledger row for professional certifications.
- **Props**:
  - `cert: CollectionEntry<'certs'>`
- **UI Elements**: Certification title, competencies, issuer, issue date, and accessible verification link. Details stack on mobile and align in ledger columns on desktop.

### `Portrait.astro`

- **Purpose**: High-contrast, responsive profile portrait image.
- **Props**:
  - `class?: string`
  - `size?: "sm" | "md" | "lg"`
- **Implementation**: Uses Astro's `<Image />` component with `src/assets/images/profile.png`, webp conversion, and fixed aspect ratios.

### `ResumeButton.astro`

- **Purpose**: Standardized resume download / view action button.
- **Props**:
  - `variant?: "pill" | "link"`
  - `class?: string`
- **Destination**: Links externally to hosted RxResume profile with `target="_blank"` and `rel="noopener noreferrer"`.

---

## Homepage Sections (`src/components/home/`)

| Component                 | Responsibility                                                                                         | Queried Content         |
| :------------------------ | :----------------------------------------------------------------------------------------------------- | :---------------------- |
| `HeroSection.astro`       | Status badge ("Available for Roles"), page H1, bio elevator pitch, `Portrait` image, and CTA actions. | Static props            |
| `ImpactMetrics.astro`     | 3-column metric banner highlighting business outcomes using `MetricItem`.                              | Static props            |
| `MetricItem.astro`        | Individual numeric stat with tabular numbers and descriptive label.                                    | Static props            |
| `FeaturedWork.astro`      | Grid of featured project case studies using `ProjectCard`.                                             | `work` collection       |
| `ExperienceSection.astro` | Chronological career history cards showing company, role, focus, and stack.                            | `experience` collection |
| `RecentPosts.astro`       | 3 most recently published blog posts with date, title, and topic tags.                                 | `blog` collection       |
| `CertsSummary.astro`      | Top 2 credentials summary with a direct link to view all in `/certs`.                                  | `certs` collection      |

---

## About Page Modules (`src/components/about/`)

### `SkillCard.astro`

- Boxed card component with an uppercase category heading and a default slot for technology badges and architectural domains.

### `AcademicRow.astro`

- Two-column flex row displaying degree or research paper title, institution or conference, and tabular dates.

---

## Next Steps

- Proceed to [05 - Styling and Theming](./05-styling-and-theming.md) for design tokens and CSS setup.
- Proceed to [06 - Deployment and Operations](./06-deployment-and-operations.md) for Cloudflare deployment.
