# Documentation

Comprehensive technical documentation for the portfolio and engineering website (`stjch.in`).

## Documentation Suite

The documentation is organized into modular guides covering every layer of the architecture:

1. [Architecture Overview](./01-architecture-overview.md)  
   Core technology stack, system architecture, repository structure, path aliases, and configuration files.

2. [Content Collections](./02-content-collections.md)  
   Astro Content Layer loaders, Zod schema definitions, directory layout, and querying patterns for work case studies, blog posts, certifications, and experience.

3. [Routing and Pages](./03-routing-and-pages.md)  
   File-based routes, dynamic static paths (`getStaticPaths`), data queries, RSS feed generation, sitemap routing, and 404 handling.

4. [Components and UI](./04-components-and-ui.md)  
   Catalog of shared layouts, homepage sections, about page modules, and reusable standalone UI components with prop interfaces.

5. [Styling and Theming](./05-styling-and-theming.md)  
   Tailwind CSS v4 `@theme inline` design tokens, Fontsource Inter configuration, and the zero-FOUC tri-state (`auto`/`light`/`dark`) theme engine.

6. [Deployment and Operations](./06-deployment-and-operations.md)  
   Cloudflare Workers Static Assets deployment, `wrangler.jsonc` bindings, apex routing, CI/CD, and npm scripts.

---

## Quick Reference

| Topic               | Primary File(s)                                           | Description                                                      |
| :------------------ | :-------------------------------------------------------- | :--------------------------------------------------------------- |
| **Site Config**     | `astro.config.mjs`                                        | Astro 7 static output, React/Markdoc, dev-only Keystatic, Tailwind v4, Fontsource |
| **Edge Config**     | `wrangler.jsonc`                                          | Cloudflare Workers Static Assets, `./dist`, apex custom domain   |
| **Content Schemas** | `src/content.config.ts`                                   | Zod schemas and `glob()` collection loaders                       |
| **Theme Engine**    | `src/components/ThemeProvider.astro`, `ThemeToggle.astro` | Tri-state theme switcher with inline FOUC prevention             |
| **Global Styles**   | `src/styles/global.css`                                   | Tailwind v4 import, theme color variables, custom dark variant   |
| **Main Layout**     | `src/layouts/BaseLayout.astro`                            | HTML shell, canonical/social metadata, JSON-LD, accessible site frame |


## Development & Build Commands

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Run type and Astro template diagnostics
npm run check

# Build production bundle
npm run build

# Preview the built Astro site
npm run preview
# Preview/deploy Cloudflare Workers Static Assets (build first)
npx wrangler dev
npx wrangler deploy
```
