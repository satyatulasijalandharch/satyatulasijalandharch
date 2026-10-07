/**
 * Safely serialize JSON-LD object to string preventing script injection.
 */
export function serializeJsonLd(schema: Record<string, unknown>): string {
    return JSON.stringify(schema).replace(/</g, "\\u003c");
}

export interface WebsiteSchemaOptions {
    siteUrl: string;
    siteName: string;
}

export function buildWebsiteSchema({ siteUrl, siteName }: WebsiteSchemaOptions): Record<string, unknown> {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": new URL("#website", siteUrl).href,
        url: siteUrl,
        name: siteName,
        inLanguage: "en",
    };
}

export interface BlogPostSchemaOptions {
    postUrl: string;
    title: string;
    description: string;
    pubDate: Date;
    updatedDate?: Date | null;
    topic: string;
}

export function buildBlogPostSchema({
    postUrl,
    title,
    description,
    pubDate,
    updatedDate,
    topic,
}: BlogPostSchemaOptions): Record<string, unknown> {
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${postUrl}#blogposting`,
        mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
        headline: title,
        description,
        datePublished: pubDate.toISOString(),
        ...(updatedDate && {
            dateModified: updatedDate.toISOString(),
        }),
        articleSection: topic,
        inLanguage: "en",
    };
}

export interface CaseStudySchemaOptions {
    caseStudyUrl: string;
    title: string;
    description: string;
    stack: string[];
    period: string;
}

export function buildCaseStudySchema({
    caseStudyUrl,
    title,
    description,
    stack,
    period,
}: CaseStudySchemaOptions): Record<string, unknown> {
    return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "@id": `${caseStudyUrl}#case-study`,
        url: caseStudyUrl,
        name: title,
        description,
        keywords: stack,
        temporalCoverage: period,
    };
}

export interface ProfileSchemaOptions {
    profileUrl: string;
    name: string;
    jobTitle: string;
    sameAs: string[];
    knowsAbout: string[];
}

export function buildProfileSchema({
    profileUrl,
    name,
    jobTitle,
    sameAs,
    knowsAbout,
}: ProfileSchemaOptions): Record<string, unknown> {
    return {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": `${profileUrl}#profile`,
        url: profileUrl,
        inLanguage: "en",
        mainEntity: {
            "@type": "Person",
            "@id": `${profileUrl}#person`,
            name,
            url: profileUrl,
            jobTitle,
            sameAs,
            knowsAbout,
        },
    };
}
