import React from "react";
import {
  Box,
  Text,
  HStack,
  Tag,
  useColorMode,
  Icon,
  Tooltip,
  VStack,
  Avatar,
} from "@chakra-ui/react";
import { CalendarIcon, TimeIcon } from "@chakra-ui/icons";
import { MdGrade } from "react-icons/md";
import dayjs from "dayjs";

const ContestAttemptingDetails = ({ contestAttempts }) => {
  const { colorMode } = useColorMode();

  if (!contestAttempts || contestAttempts.length === 0) {
    return (
      <Text color="gray.500" fontSize="md" textAlign="center" mt={4}>
        No ongoing contest attempts.
      </Text>
    );
  }

  return (
    <Box my={6}>
      <Text
        fontSize="xl"
        fontWeight="bold"
        mb={4}
        textAlign="center"
        color={colorMode === "light" ? "teal.600" : "teal.300"}
      >
        Ongoing Contest Attempts
      </Text>
      <VStack spacing={4} align="stretch">
        {contestAttempts.map((attempt) => (
          <HStack
            key={attempt.id}
            p={4}
            borderRadius="md"
            shadow="md"
            bg={colorMode === "light" ? "white" : "gray.800"}
            alignItems="center"
            justifyContent="space-between"
            spacing={6}
            _hover={{
              bg: colorMode === "light" ? "gray.100" : "gray.700",
            }}
          >
            {/* Student Info */}
            <HStack spacing={3}>
              <Avatar name={attempt.username} size="sm" />
              <Box>
                <Text
                  fontWeight="bold"
                  color={colorMode === "light" ? "blue.600" : "blue.300"}
                >
                  {attempt.username}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {attempt.email}
                </Text>
              </Box>
            </HStack>

            {/* Start Time */}
            <HStack spacing={1}>
              <Tooltip label="Start Time" aria-label="Start Time Tooltip">
                <Icon as={CalendarIcon} color="teal.500" />
              </Tooltip>
              <Text
                fontSize="sm"
                color={colorMode === "light" ? "gray.700" : "gray.300"}
              >
                {dayjs(attempt.startTime).format("MMM D, YYYY - hh:mm A")}
              </Text>
            </HStack>

            {/* End Time */}
            <HStack spacing={1}>
              <Tooltip label="End Time" aria-label="End Time Tooltip">
                <Icon as={TimeIcon} color="red.500" />
              </Tooltip>
              <Text
                fontSize="sm"
                color={colorMode === "light" ? "gray.700" : "gray.300"}
              >
                {attempt.endTime
                  ? dayjs(attempt.endTime).format("MMM D, YYYY - hh:mm A")
                  : "Ongoing"}
              </Text>
            </HStack>

            {/* Total Marks */}
            <HStack spacing={1}>
              <Tooltip label="Total Marks" aria-label="Total Marks Tooltip">
                <Icon as={MdGrade} color="yellow.400" />
              </Tooltip>
              <Text
                fontSize="sm"
                color={colorMode === "light" ? "gray.700" : "gray.300"}
              >
                {attempt.obtainMarks !== null
                  ? `${attempt.obtainMarks} / ${attempt.totalMarks}`
                  : `N/A / ${attempt.totalMarks}`}
              </Text>
            </HStack>

            {/* Attempt Status */}
            <Tag size="md" colorScheme={attempt.endTime ? "green" : "orange"}>
              {attempt.endTime ? "Completed" : "In Progress"}
            </Tag>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default ContestAttemptingDetails;
