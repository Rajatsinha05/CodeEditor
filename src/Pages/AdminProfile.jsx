import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Grid,
  GridItem,
  useColorModeValue,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import { FaUserShield, FaUsers, FaTasks, FaTrophy } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudents,
  fetchStudentsByBranchCode,
} from "../redux/Student/studentsSlice";
import {
  fetchAllActiveBatches,
  fetchBatchesByStudentId,
  fetchBatchesByUserId,
} from "../redux/Batch/batchSlice";
import { showToast } from "../utils/toastUtils";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminProfile = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const hoverBgColor = useColorModeValue("red.50", "teal.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const iconColor = useColorModeValue("red.400", "teal.300");
  const headingColor = useColorModeValue("red.600", "teal.200");

  const { user } = useSelector((store) => store.user);
  const { students, loading: studentsLoading } = useSelector(
    (store) => store.student
  );
  const { allActiveBatches: batches, loading: batchesLoading } = useSelector(
    (store) => store.batch
  );

  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    if (user?.role === "ADMIN") {
      dispatch(fetchStudentsByBranchCode(user.branchCode));
    } else if (user?.role === "SUPERADMIN") {
      dispatch(fetchStudents());
    }
  }, [dispatch, user?.role, user?.branchCode]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        if (user?.role === "SUPERADMIN")
          await dispatch(fetchAllActiveBatches());
        else if (user?.role === "ADMIN")
          await dispatch(fetchBatchesByUserId(user.id));
        else if (user?.role === "STUDENT")
          await dispatch(fetchBatchesByStudentId(user.id));
      } catch (err) {
        showToast(toast, err.message || "Failed to fetch batches", "error");
      }
    };
    fetchBatches();
  }, [dispatch, user?.role, user?.id, toast]);

  const contestCount = useMemo(
    () =>
      batches?.reduce(
        (total, batch) => total + (batch.contestIds?.length || 0),
        0
      ),
    [batches]
  );

  const chartData = useMemo(
    () => ({
      labels: ["Students", "Contests", "Batches"],
      datasets: [
        {
          label: "Overview",
          data: [students.length, contestCount, batches.length],
          backgroundColor: ["#FEB2B2", "#FC8181", "#F56565"],
          borderColor: ["#FC8181", "#E53E3E", "#C53030"],
          borderWidth: 1,
        },
      ],
    }),
    [students.length, contestCount, batches.length]
  );

  if (studentsLoading || batchesLoading) {
    return (
      <Box
        bg={bgColor}
        p={8}
        borderRadius="lg"
        boxShadow="2xl"
        mx="auto"
        mt={8}
      >
        <VStack spacing={8}>
          <Skeleton height="80px" width="100%" />
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
            {new Array(3).fill(null).map((_, idx) => (
              <Skeleton height="150px" borderRadius="lg" key={idx} />
            ))}
          </Grid>
          <Skeleton height="300px" width="100%" borderRadius="lg" />
        </VStack>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="2xl" mx="auto" mt={8}>
      <VStack spacing={8} align="stretch">
        <Box p={6} bg={cardBgColor} borderRadius="lg" boxShadow="xl">
          <HStack spacing={6}>
            <Icon as={FaUserShield} color={iconColor} boxSize={10} />
            <VStack align="start" spacing={1}>
              <Heading size="lg" color={headingColor}>
                Welcome, {user?.name}!
              </Heading>
            </VStack>
          </HStack>
        </Box>
        <Box p={6} bg={cardBgColor} borderRadius="lg" boxShadow="xl">
          <Heading size="md" color={headingColor} mb={4}>
            Data Overview
          </Heading>
          <Bar data={chartData} />
        </Box>
      </VStack>
    </Box>
  );
};

export default AdminProfile;
