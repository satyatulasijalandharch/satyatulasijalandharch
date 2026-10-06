import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

const staticPaths = ["/", "/about", "/certs", "/blog", "/work"];

const escapeXml = (value: string) =>
    value.replace(/[<>&'\"]/g, (character) => {
        const entities: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&apos;",
            '"': "&quot;",
        };
        return entities[character];
    });

export const GET: APIRoute = async ({ site, url }) => {
    const [posts, projects] = await Promise.all([
        getCollection("blog", ({ data }) => !data.draft),
        getCollection("work"),
    ]);
    const baseUrl = site ?? new URL(url.origin);
    const paths = [
        ...staticPaths,
        ...posts.map(({ id }) => `/blog/${id}`),
        ...projects.map(({ id }) => `/work/${id}`),
    ];
    const entries = paths
        .map((path) => `  <url><loc>${escapeXml(new URL(path, baseUrl).href)}</loc></url>`)
        .join("\n");

    return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`,
        { headers: { "Content-Type": "application/xml; charset=utf-8" } },
    );
};