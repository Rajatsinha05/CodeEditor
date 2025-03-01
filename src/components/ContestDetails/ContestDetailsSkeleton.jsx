import { Box, Skeleton } from "@chakra-ui/react";

// Skeleton for Contest Details Component
const ContestDetailsSkeleton = () => {
  return (
    <Box p={8} maxW="1000px" mx="auto" borderRadius="lg" shadow="lg">
      {/* Header Skeleton */}
      <Skeleton height="40px" mb={4} />

      {/* Contest Details Skeleton */}
      <Skeleton height="100px" mb={4} />

      {/* Questions Skeleton */}
      <Skeleton height="200px" mb={4} />

      {/* Student Rankings Skeleton */}
      <Skeleton height="150px" mb={4} />

      {/* Admin Sections Skeleton */}
      <Skeleton height="200px" mb={4} />

      {/* Submit Contest Button Skeleton */}
      <Skeleton height="40px" />
    </Box>
  );
};
export default ContestDetailsSkeleton;
