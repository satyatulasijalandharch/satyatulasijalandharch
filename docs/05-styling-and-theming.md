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

Semantic tokens are declared through Tailwind's `@theme inline` in `src/styles/global.css`; concrete light and dark values are set in `:root` and `.dark`.

### Color Mapping Table

| CSS Variable         | Light Theme | Dark Theme | Purpose                      |
| :------------------- | :---------- | :--------- | :--------------------------- |
| `--color-background`   | `#FBFBFB`   | `#0A0A0A`  | Canvas root background       |
| `--color-surface`      | `#F4F4F5`   | `#18181B`  | Card and component surfaces  |
| `--color-surface-subtle` | `#FAFAFA` | `#111111`  | Header / footer subtle fills |
| `--color-border`       | `#E4E4E7`   | `#27272A`  | Card outlines and dividers   |
| `--color-text-primary` | `#111111`   | `#FAFAFA`  | Primary headings and text    |
| `--color-text-secondary` | `#52525B` | `#A1A1AA`  | Body copy and descriptions   |
| `--color-text-muted`   | `#6D6D76`   | `#80808A`  | Captions, dates, meta info   |
| `--color-status-available` | `#16A34A` | `#22C55E` | Availability indicator dot |

---

## Typography & Font Loading

### Inter Variable Font

Configured using Astro's Font Providers in `astro.config.mjs`:

```javascript
fonts: [
  {
    provider: fontProviders.fontsource(),
    name: "Inter",
    cssVariable: "--font-sans",
  },
];
```

- Emits self-hosted font assets during the build.
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
