const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

/**
 * Format date for blog posts or listings (e.g. "Oct 7, 2026")
 */
export function formatDate(
    date: Date,
    options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    },
    locale = "en-US",
): string {
    return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Format date with month and year only (e.g. "Oct 2026")
 */
export function formatMonthYear(date: Date, locale = "en-US"): string {
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
    }).format(date);
}

/**
 * Parse an "MMM YYYY" string (e.g. "Jan 2024") into numeric value for sorting.
 * Higher number = more recent.
 */
export function issueDateOrder(issueDate: string): number {
    const [month, year] = issueDate.split(" ");
    const monthIndex = MONTHS.indexOf(month);
    return Number(year) * 12 + (monthIndex >= 0 ? monthIndex : 0);
}
