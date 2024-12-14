import React, { useEffect, useState } from "react";
import { Box, VStack, useColorModeValue, useToast } from "@chakra-ui/react";
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const batches = useSelector((store) => store.batch.allActiveBatches);
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
        setLoading(true);
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
        setLoading(false);
      }
    };

    loadBatches();
  }, [dispatch, toast, user]);

  const bgColor = useColorModeValue("white", "gray.800");

  if (loading) return <Loader />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <Box
      maxW="1200px"
      mx="auto"
      px={6}
      py={10}
      mt={2} // Added margin from the top
      bg={bgColor}
      rounded="lg"
      shadow="lg"
    >
      <VStack spacing={6} align="stretch">
        {/* Filter Section */}
        <FilterSection filters={filters} setFilters={setFilters} />

        {/* Batch List */}
        <BatchList batches={filteredBatches} />
      </VStack>
    </Box>
  );
};

export default BatchListPage;
