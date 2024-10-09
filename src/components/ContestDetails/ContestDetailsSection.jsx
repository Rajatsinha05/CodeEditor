import React from "react";
import { Box, Text, Badge, HStack, Icon, Divider } from "@chakra-ui/react";
import { CalendarIcon, TimeIcon } from "@chakra-ui/icons";

const formatDateTime12Hour = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric", hour12: true };
  return new Date(dateString).toLocaleString("en-US", options);
};

const ContestDetailsSection = ({ contest, colorMode }) => (
  <>
    {contest?.difficultyLevel && (
      <Box mb={6}>
        <Badge colorScheme="purple" fontSize="0.8em" p={1} borderRadius="md">
          Difficulty: {contest.difficultyLevel}
        </Badge>
      </Box>
    )}

    {contest?.startTime && contest?.endTime && (
      <HStack mb={6} spacing={4}>
        <HStack>
          <Icon as={CalendarIcon} color={colorMode === "light" ? "gray.500" : "gray.400"} />
          <Text fontSize="md" color={colorMode === "light" ? "gray.600" : "gray.400"}>
            Starts: {formatDateTime12Hour(contest.startTime)}
          </Text>
        </HStack>
        <HStack>
          <Icon as={TimeIcon} color={colorMode === "light" ? "gray.500" : "gray.400"} />
          <Text fontSize="md" color={colorMode === "light" ? "gray.600" : "gray.400"}>
            Ends: {formatDateTime12Hour(contest.endTime)}
          </Text>
        </HStack>
      </HStack>
    )}

    {contest?.totalMarks && (
      <Box mb={6}>
        <Text fontSize="lg" fontWeight="bold" color={colorMode === "light" ? "gray.700" : "gray.300"}>
          Total Marks: {contest.totalMarks}
        </Text>
      </Box>
    )}

    {contest?.description && (
      <Box my={6}>
        <Text fontSize="lg" fontWeight="semibold" mb={2} color={colorMode === "light" ? "gray.700" : "gray.300"}>
          Description
        </Text>
        <Text fontSize="md" color={colorMode === "light" ? "gray.600" : "gray.400"}>
          {contest.description}
        </Text>
      </Box>
    )}

    <Divider borderColor={colorMode === "light" ? "gray.300" : "gray.600"} />
  </>
);

export default ContestDetailsSection;
