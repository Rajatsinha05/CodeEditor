import React from "react";
import {
  Box,
  Text,
  Badge,
  HStack,
  Icon,
  Divider,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { CalendarIcon, TimeIcon } from "@chakra-ui/icons";

const formatDateTime12Hour = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return new Date(dateString).toLocaleString("en-US", options);
};

const ContestDetailsSection = ({ contest, user }) => {
  const currentTime = new Date();
  const contestEnded = new Date(contest.endTime) < currentTime;
  const isAdmin = user?.role === "SUPERADMIN" || user?.role === "ADMIN";

  // Dynamic styles
  const textColor = useColorModeValue("gray.700", "gray.300");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const dividerColor = useColorModeValue("gray.300", "gray.600");
  const badgeBg = useColorModeValue("purple.100", "purple.800");

  return (
    <Box
      p={6}
      borderRadius="lg"
      shadow="md"
      bg={useColorModeValue("white", "gray.700")}
      transition="all 0.3s ease"
      _hover={{ shadow: "lg" }}
    >
      {contest?.difficultyLevel && (
        <Box mb={4}>
          <Badge
            bg={badgeBg}
            color="purple.500"
            fontSize="0.9em"
            px={2}
            py={1}
            borderRadius="md"
            shadow="sm"
          >
            Difficulty: {contest.difficultyLevel}
          </Badge>
        </Box>
      )}

      {contest?.startTime && contest?.endTime && (
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          align="start"
          mb={6}
        >
          <HStack>
            <Icon as={CalendarIcon} color="purple.400" />
            <Text fontSize="md" color={subTextColor}>
              Starts: {formatDateTime12Hour(contest.startTime)}
            </Text>
          </HStack>
          <HStack>
            <Icon as={TimeIcon} color="red.400" />
            <Text fontSize="md" color={subTextColor}>
              Ends: {formatDateTime12Hour(contest.endTime)}
            </Text>
          </HStack>
        </Stack>
      )}

      {contest?.totalMarks && (
        <Box mb={4}>
          <Text fontSize="lg" fontWeight="bold" color={textColor}>
            Total Marks: {contest.totalMarks}
          </Text>
        </Box>
      )}

      {contest?.description && (
        <Box my={4}>
          <Text fontSize="lg" fontWeight="semibold" mb={2} color={textColor}>
            Description
          </Text>
          <Box
            mt={2}
            color={textColor}
            dangerouslySetInnerHTML={{
              __html: contest?.description || "No description provided.",
            }}
          />
        </Box>
      )}

      <Divider borderColor={dividerColor} my={4} />

      {isAdmin && (
        <Box mt={6}>
          <Text fontSize="sm" color={subTextColor}>
            *Admin Actions Placeholder (e.g., Edit/Delete Contest)*
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(ContestDetailsSection);
