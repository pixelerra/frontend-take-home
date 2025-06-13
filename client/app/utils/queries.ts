/**
 * Helper function generates a query key for caching paginated API results.
 *
 * @param page - the page number
 * @param filters - filters to apply to the query
 *
 * @returns a string representing the query key
 */
export function getQueryKey<TFilters>(
  prefix: string,
  page: number,
  filters: TFilters
) {
  const params = new URLSearchParams({
    page: page.toString(),
    ...filters,
  });

  return `${prefix}?${params.toString()}`;
}
