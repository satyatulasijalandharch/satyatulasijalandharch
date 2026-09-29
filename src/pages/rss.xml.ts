import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
    const posts = await getCollection("blog", ({ data }) => !data.draft);

    return rss({
        title: "Satya Tulasi Jalandhar C H | Engineering Notes",
        description:
            "Technical notes and architecture postmortems on cloud cost optimization, serverless patterns, and container infrastructure.",
        site: context.site ?? context.url,
        trailingSlash: false,
        items: posts
            .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
            .map((post) => ({
                title: post.data.title,
                pubDate: post.data.pubDate,
                description: post.data.description,
                link: `/blog/${post.id}`,
            })),
        customData: "<language>en-us</language>",
    });
};