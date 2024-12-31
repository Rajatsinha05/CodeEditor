import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  useColorModeValue,
  useToast,
  Flex,
  Divider,
  Text,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllActiveBatches,
  fetchBatchesByUserId,
  fetchBatchesByStudentId,
} from "../redux/Batch/batchSlice";
import { showToast } from "../utils/toastUtils";
import FilterSection from "../components/Batch/FilterSection";
import BatchList from "../components/Batch/BatchList";
import Loader from "../components/Batch/Loader";
import ErrorDisplay from "../components/Batch/ErrorDisplay";
import dayjs from "dayjs";

const BatchListPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [isLoading, setisLoading] = useState(true);
  const [error, setError] = useState(null);

  const batches = useSelector((store) => store.batch.allActiveBatches);
  const { loading } = useSelector((store) => store.batch);
  const user = useSelector((store) => store.data.user);

  const [filters, setFilters] = useState({
    branch: "",
    name: "",
    month: "",
    year: "",
  });

  const filteredBatches = batches.filter((batch) => {
    const matchesBranch =
      !filters.branch || batch.branchCode === filters.branch;
    const matchesName =
      !filters.name ||
      batch.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesMonth =
      !filters.month || dayjs(batch.createdAt).format("MMMM") === filters.month;
    const matchesYear =
      !filters.year || dayjs(batch.createdAt).format("YYYY") === filters.year;
    return matchesBranch && matchesName && matchesMonth && matchesYear;
  });

  useEffect(() => {
    const loadBatches = async () => {
      try {
        setisLoading(true);
        setError(null);

        if (user?.role === "SUPERADMIN") {
          await dispatch(fetchAllActiveBatches()).unwrap();
        } else if (user?.role === "ADMIN") {
          await dispatch(fetchBatchesByUserId(user.id)).unwrap();
        } else if (user?.role === "STUDENT") {
          await dispatch(fetchBatchesByStudentId(user.id)).unwrap();
        }
      } catch (err) {
        setError(err.message || "Failed to fetch batches");
        showToast(toast, err.message || "Failed to fetch batches", "error");
      } finally {
        setisLoading(false);
      }
    };

    loadBatches();
  }, [dispatch, toast, user]);

  const bgColor = useColorModeValue("white", "gray.800");

  if (isLoading) {
    return (
      <Box
        maxW="1200px"
        mx="auto"
        px={6}
        py={6}
        mt={5}
        bg={bgColor}
        rounded="lg"
        shadow="lg"
      >
        <VStack spacing={6} align="stretch">
          <Flex justify="space-between" align="center">
            <Skeleton height="24px" width="200px" />
            <Skeleton height="24px" width="300px" />
          </Flex>
          <Divider />
          {[...Array(5)].map((_, index) => (
            <Box key={index} p={4} borderWidth="1px" rounded="lg">
              <Skeleton height="20px" mb={2} />
              <SkeletonText noOfLines={3} spacing="4" />
            </Box>
          ))}
        </VStack>
      </Box>
    );
  }

  if (error) return <ErrorDisplay error={error} />;

  return (
    <Box
      maxW="1200px"
      mx="auto"
      px={6}
      py={6}
      mt={5}
      bg={bgColor}
      rounded="lg"
      shadow="lg"
    >
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="bold" ml={4}>
            Batches
          </Text>
          <FilterSection filters={filters} setFilters={setFilters} />
        </Flex>
        <Divider />
        {/* Batch List */}
        {filteredBatches.length > 0 ? (
          <BatchList batches={filteredBatches} isLoading={loading} />
        ) : (
          <Text textAlign="center" color="gray.500">
            No batches found matching the current filters.
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default React.memo(BatchListPage);
