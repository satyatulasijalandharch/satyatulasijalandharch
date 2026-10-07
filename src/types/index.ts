import type { CollectionEntry } from "astro:content";

export type WorkEntry = CollectionEntry<"work">;
export type BlogEntry = CollectionEntry<"blog">;
export type CertEntry = CollectionEntry<"certs">;
export type ExperienceEntry = CollectionEntry<"experience">;

export type WorkData = WorkEntry["data"];
export type BlogData = BlogEntry["data"];
export type CertData = CertEntry["data"];
export type ExperienceData = ExperienceEntry["data"];

export interface Competency {
    title: string;
    description: string;
}

export interface PublicationItem {
    title: string;
    date: string;
    description: string;
    url?: string;
}

