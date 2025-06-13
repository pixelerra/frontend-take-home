import { Box, Flex, Skeleton } from "@radix-ui/themes";

export function RouteSkeleton() {
  return (
    <Flex direction="column" gap="4" p="4">
      {/* Search bar skeleton */}
      <Box>
        <Skeleton height="36px" width="100%" />
      </Box>

      {/* Table placeholder */}
      <Box>
        <Skeleton height="480px" width="100%" />
      </Box>

      {/* Footer / Pagination */}
      <Flex justify="end">
        <Skeleton height="36px" width="120px" />
      </Flex>
    </Flex>
  );
}
