# 05 - Styling and Theming

This document details the Tailwind CSS v4 setup, color tokens, typography configuration, and zero-FOUC tri-state theming architecture.

## Tailwind CSS v4 Architecture

The site uses **Tailwind CSS v4** directly through the `@tailwindcss/vite` plugin registered in `astro.config.mjs`:

```javascript
// astro.config.mjs
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  // ...
});
```

Styles are imported in `src/styles/global.css`:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

The `@custom-variant dark` directive instructs Tailwind v4 to apply `dark:` variant utilities when the `.dark` class is present on `document.documentElement` or any ancestor element.

---

## Design Tokens (`@theme inline`)

Semantic color tokens are defined inside `@theme inline` in `src/styles/global.css`:

```css
@theme inline {
  --color-background: var(--bg);
  --color-surface: var(--surface);
  --color-surface-subtle: var(--surface-subtle);
  --color-border: var(--border);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);
  --color-status-available: var(--status-available);
  --font-sans: "Inter", sans-serif;
}
```

### Color Mapping Table

| CSS Variable         | Light Theme | Dark Theme | Purpose                      |
| :------------------- | :---------- | :--------- | :--------------------------- |
| `--bg`               | `#FBFBFB`   | `#0A0A0A`  | Canvas root background       |
| `--surface`          | `#F4F4F5`   | `#18181B`  | Card and component surfaces  |
| `--surface-subtle`   | `#FAFAFA`   | `#111111`  | Header / footer subtle fills |
| `--border`           | `#E4E4E7`   | `#27272A`  | Card outlines and dividers   |
| `--text-primary`     | `#111111`   | `#FAFAFA`  | Primary headings and text    |
| `--text-secondary`   | `#52525B`   | `#A1A1AA`  | Body copy and descriptions   |
| `--text-muted`       | `#71717A`   | `#71717A`  | Captions, dates, meta info   |
| `--status-available` | `#16A34A`   | `#22C55E`  | Availability indicator dot   |

---

## Typography & Font Loading

### Inter Variable Font

Configured using Astro's Font Providers in `astro.config.mjs`:

```javascript
fonts: [
  {
    name: "Inter",
    provider: fontProviders.fontsource(),
    css: [
      {
        src: "@fontsource-variable/inter/index.css",
      },
    ],
    fallback: "sans-serif",
  },
];
```

- Injects font stylesheet automatically at build time.
- Zero layout shift (CLS) by utilizing `@fontsource-variable/inter`.
- Mapped to `--font-sans` in Tailwind.

### Tabular Numbers Helper

Monospace digit alignment for dates, metrics, and counters is enforced via the `.tabular-nums` class:

```css
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
```

---

## Zero-FOUC Tri-State Theming Engine

The site supports three theme modes:

1. **`auto`**: Follows user's operating system setting (`prefers-color-scheme`).
2. **`light`**: Explicit light mode.
3. **`dark`**: Explicit dark mode.

### 1. FOUC Prevention (`ThemeProvider.astro`)

To prevent Flash of Unstyled Content (FOUC), an inline script executes in `<head>` before the DOM renders:

```html
<script is:inline>
  (function () {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const theme = stored || "auto";
    const isDark = theme === "dark" || (theme === "auto" && prefersDark);

    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.setAttribute("data-theme", theme);
  })();
</script>
```

### 2. Tri-State Theme Switcher (`ThemeToggle.astro`)

The toggle button in `SiteHeader` allows the user to cycle modes:

```
[auto] -> click -> [light] -> click -> [dark] -> click -> [auto]
```

- Writes choice to `localStorage.setItem('theme', nextTheme)`.
- Synchronizes `.dark` class and `data-theme` on `<html>`.
- Listens to `window.matchMedia('(prefers-color-scheme: dark)')` to update dynamically when in `auto` mode.
- Uses `astro:after-swap` event listener for Astro view transition compatibility.

---

## Next Steps

- Proceed to [06 - Deployment and Operations](./06-deployment-and-operations.md) for Cloudflare configuration and commands.
