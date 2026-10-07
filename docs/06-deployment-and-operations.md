# 06 - Deployment and Operations

This document covers static site deployment to Cloudflare, `wrangler.jsonc` configuration, DNS routing, and operations workflows.

## Deployment Architecture

The application is built as a static Astro site and deployed to **Cloudflare Workers Static Assets** with **Wrangler**:

```mermaid
graph LR
    Dev[Developer] -->|git push| Build[astro build]
    Build -->|Static output| Dist[./dist Directory]
    Dist -->|Wrangler deploy| CFAssets[Cloudflare Workers Static Assets]
    CFAssets --> User[Client / Browser]
```

- **Static output**: HTML, CSS, JavaScript chunks, optimized images, feeds, and sitemap are built into `./dist`.
- **No Astro SSR runtime**: No Astro Cloudflare adapter is configured. Wrangler serves the built files through Workers Static Assets.

---

## Wrangler Configuration (`wrangler.jsonc`)

The runtime and edge infrastructure are defined in `wrangler.jsonc`:

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "satyatulasijalandharch",
  "compatibility_date": "2026-09-26",
  "compatibility_flags": ["global_fetch_strictly_public"],
  "assets": {
    "directory": "./dist",
    "html_handling": "drop-trailing-slash",
    "not_found_handling": "404-page",
  },
  "observability": {
    "enabled": true,
    "logs": { "enabled": true, "invocation_logs": true, "persist": true },
    "traces": { "enabled": true },
  },
  "workers_dev": false,
  "preview_urls": false,
  "routes": [
    {
      "pattern": "stjch.in",
      "custom_domain": true,
      "previews_enabled": true,
    },
  ],
}
```

### Key Directives:

- `compatibility_date`: Fixed compatibility target (`2026-09-26`).
- `assets.directory`: Publishes the static site generated in `./dist`.
- `assets.html_handling: "drop-trailing-slash"`: Matches Astro's `trailingSlash: 'never'` setting.
- `assets.not_found_handling: "404-page"`: Automatically routes 404 responses to `./dist/404.html`.
- `routes`: Binds the production apex domain `stjch.in`; `www.stjch.in` is not configured and currently returns 404.
- `observability`: Invocation logs and traces are enabled in Cloudflare.

---

## NPM Scripts & Operational Workflows

Project commands are configured in `package.json`:

```json
"scripts": {
  "astro": "astro",
  "dev": "astro dev",
  "check": "astro check",
  "build": "astro build",
  "preview": "astro preview"
}
```

### 1. Local Development

```bash
# Start the Astro development server
npm run dev
```

### 2. Code Quality & Verification

```bash
# Validates TypeScript types and Astro component syntax
npm run check
```

### 3. Cloudflare Preview and Deployment

The GitHub Actions workflow runs `npm ci`, `npm run check`, and `npm run build`. Pull requests publish Wrangler previews; pushes to `main` run `wrangler deploy` for production. For local Workers Static Assets emulation, build first and run `npx wrangler dev`.

---

## Local Keystatic Authoring

The Keystatic Admin UI uses local filesystem storage and is available only during development. Run `npm run dev` and open `http://localhost:4321/keystatic`. Astro uses Node.js locally, which Keystatic needs for filesystem APIs. Production builds do not register Keystatic, so the deployed site does not expose a local-storage editor.

Keystatic changes files under `src/content/`. Review and commit those files to publish content through the existing GitHub Actions deployment workflow. Production editing is not configured; it would require a separate storage and hosting decision.

---

## Cloudflare DNS & Custom Domains

The Wrangler config binds the apex custom domain:

- Apex: `stjch.in`

The canonical URLs use `https://stjch.in`. The live `www.stjch.in` host currently returns 404. If the `www` hostname should be supported, choose and configure a permanent redirect to the apex at Cloudflare, then verify the redirect and update this document; do not add it as a second indexable host without a redirect.
