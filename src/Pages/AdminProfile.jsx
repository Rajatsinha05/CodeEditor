import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
  Grid,
  GridItem,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import {
  FaUserShield,
  FaUsers,
  FaTasks,
  FaTrophy,
  FaClipboardList,
  FaPlus,
  FaFileExport,
} from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
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

const AdminProfile = () => {
  // Theme-based colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const hoverBgColor = useColorModeValue("red.50", "teal.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const iconColor = useColorModeValue("red.400", "teal.300");
  const headingColor = useColorModeValue("red.600", "teal.200");

  const { user } = useSelector((store) => store.user);
  const { students } = useSelector((store) => store.student);
  const batches = useSelector((store) => store.batch.allActiveBatches);

  const dispatch = useDispatch();
  const toast = useToast();

  const [contestCount, setContestCount] = useState(0);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      dispatch(fetchStudentsByBranchCode(user.branchCode));
    } else {
      dispatch(fetchStudents());
    }

    const fetchBatches = async () => {
      try {
        if (user?.role === "SUPERADMIN")
          await dispatch(fetchAllActiveBatches());
        if (user?.role === "ADMIN")
          await dispatch(fetchBatchesByUserId(user.id));
        if (user?.role === "STUDENT")
          await dispatch(fetchBatchesByStudentId(user.id));
      } catch (err) {
        showToast(toast, err.message || "Failed to fetch batches", "error");
      }
    };
    fetchBatches();
  }, [dispatch, user, toast]);

  useEffect(() => {
    setContestCount(
      batches?.reduce(
        (total, batch) => total + (batch.contestIds?.length || 0),
        0
      )
    );
  }, [batches]);

  // Chart configuration
  const chartData = {
    labels: ["Students", "Contests", "Batches"],
    datasets: [
      {
        label: "Overview",
        data: [students.length, contestCount, batches.length],
        backgroundColor: [
          useColorModeValue("#FEB2B2", "#2C7A7B"),
          useColorModeValue("#FC8181", "#319795"),
          useColorModeValue("#F56565", "#285E61"),
        ],
        borderColor: [
          useColorModeValue("#FC8181", "#2C7A7B"),
          useColorModeValue("#E53E3E", "#319795"),
          useColorModeValue("#C53030", "#285E61"),
        ],
        borderWidth: 1,
        hoverBackgroundColor: [
          useColorModeValue("#FEE2E2", "#4FD1C5"),
          useColorModeValue("#FED7D7", "#38B2AC"),
          useColorModeValue("#FEB2B2", "#2C7A7B"),
        ],
      },
    ],
  };

  return (
    <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="2xl" mx="auto" mt={8}>
      <VStack spacing={8} align="stretch">
        {/* Welcome Section */}
        <Box p={6} bg={cardBgColor} borderRadius="lg" boxShadow="xl">
          <HStack spacing={6}>
            <Icon as={FaUserShield} color={iconColor} boxSize={10} />
            <VStack align="start" spacing={1}>
              <Heading size="lg" color={headingColor}>
                Welcome, {user?.name}!
              </Heading>
              <Text fontSize="md" color={textColor}>
                Manage your dashboard effortlessly and stay organized.
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Statistics Cards */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
          {[
            { label: "Total Students", value: students.length, icon: FaUsers },
            { label: "Active Contests", value: contestCount, icon: FaTasks },
            { label: "Batches", value: batches.length, icon: FaTrophy },
          ].map((stat, idx) => (
            <GridItem
              key={idx}
              p={6}
              bg={cardBgColor}
              borderRadius="lg"
              boxShadow="md"
              _hover={{ bg: hoverBgColor, transform: "scale(1.02)" }}
              transition="0.3s ease"
            >
              <HStack spacing={4}>
                <Icon as={stat.icon} color={iconColor} boxSize={8} />
                <VStack align="start">
                  <Heading size="md" color={textColor}>
                    {stat.value}
                  </Heading>
                  <Text color={textColor}>{stat.label}</Text>
                </VStack>
              </HStack>
            </GridItem>
          ))}
        </Grid>

        {/* Chart Section */}
        <Box p={6} bg={cardBgColor} borderRadius="lg" boxShadow="xl">
          <Heading size="md" color={headingColor} mb={4}>
            Data Overview
          </Heading>
          <Bar data={chartData} />
        </Box>

        {/* Quick Actions */}
        <Box p={6} bg={cardBgColor} borderRadius="lg" boxShadow="lg">
          <Heading size="md" color={headingColor} mb={4}>
            Quick Actions
          </Heading>
          <HStack spacing={6} wrap="wrap">
            {[
              { label: "Add Student", icon: FaPlus },
              { label: "Generate Reports", icon: FaClipboardList },
              { label: "Manage Contests", icon: FaTasks },
              { label: "Export Data", icon: FaFileExport },
            ].map((action, idx) => (
              <Button
                key={idx}
                leftIcon={<Icon as={action.icon} />}
                colorScheme="red"
                variant="solid"
                _hover={{ bg: hoverBgColor, color: textColor }}
                borderRadius="md"
              >
                {action.label}
              </Button>
            ))}
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default AdminProfile;
