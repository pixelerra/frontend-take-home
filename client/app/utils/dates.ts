/**
 *  Simple date formatting utility.
 * Formats the date as "MMM dd, yyyy" (e.g., "Jan 01, 2020").
 *
 * @param date - a date string or Date object to format
 * @returns - formatted date string
 */
export function formatDisplayDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
