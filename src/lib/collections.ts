import { getCollection, type CollectionEntry } from "astro:content";
import { issueDateOrder } from "./dates";

/**
 * Get all work entries sorted by order ascending.
 */
export async function getSortedWork(): Promise<CollectionEntry<"work">[]> {
    const works = await getCollection("work");
    return works.sort((a, b) => a.data.order - b.data.order);
}

/**
 * Get featured work entries sorted by order ascending.
 */
export async function getFeaturedWork(): Promise<CollectionEntry<"work">[]> {
    const works = await getCollection("work", ({ data }) => data.featured);
    return works.sort((a, b) => a.data.order - b.data.order);
}

/**
 * Get published blog posts sorted by publish date descending.
 */
export async function getSortedPosts(options?: {
    includeDrafts?: boolean;
    limit?: number;
}): Promise<CollectionEntry<"blog">[]> {
    const { includeDrafts = false, limit } = options ?? {};
    const posts = await getCollection("blog", ({ data }) =>
        includeDrafts ? true : !data.draft,
    );
    const sorted = posts.sort(
        (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
    );
    return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

/**
 * Get certifications sorted by issue date descending, then order ascending.
 */
export async function getSortedCerts(limit?: number): Promise<CollectionEntry<"certs">[]> {
    const certs = await getCollection("certs");
    const sorted = certs.sort(
        (a, b) =>
            issueDateOrder(b.data.issueDate) - issueDateOrder(a.data.issueDate) ||
            a.data.order - b.data.order,
    );
    return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

/**
 * Get certifications sorted by order ascending.
 */
export async function getOrderedCerts(limit?: number): Promise<CollectionEntry<"certs">[]> {
    const certs = await getCollection("certs");
    const sorted = certs.sort((a, b) => a.data.order - b.data.order);
    return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

/**
 * Get experience sorted by order ascending.
 */
export async function getSortedExperience(): Promise<CollectionEntry<"experience">[]> {
    const experience = await getCollection("experience");
    return experience.sort((a, b) => a.data.order - b.data.order);
}
