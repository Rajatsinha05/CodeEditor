import React from "react";
import {
  Box,
  VStack,
  Text,
  HStack,
  Avatar,
  Icon,
  Badge,
  Tooltip,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaTrophy } from "react-icons/fa";

const StudentRankings = ({ studentRankings, contest, user }) => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.900", "gray.100");

  return (
    <Box
      my={6}
      bg={bgColor}
      p={6}
      borderRadius="lg"
      shadow="base"
      overflow="hidden"
    >
      <Text
        fontSize="2xl"
        fontWeight="bold"
        mb={6}
        textAlign="center"
        bgGradient="linear(to-r, teal.400, blue.400)"
        bgClip="text"
      >
        Leaderboard
      </Text>
      <VStack spacing={4} align="stretch">
        {studentRankings.map((ranking, index) => {
          const student = contest.enrolledStudents.find(
            (s) => s.id.toString() === ranking.studentId
          );
          if (!student) return null;

          const isCurrentStudent = student.id.toString() === user.id.toString();

          const isTopRank = index < 3;
          const cardStyles = {
            padding: "4",
            borderRadius: "md",
            border: isTopRank
              ? "2px solid teal"
              : `1px solid ${isCurrentStudent ? "blue.500" : "transparent"}`,
            shadow: isTopRank ? "lg" : "sm",
          };

          return (
            <Flex
              key={ranking.studentId}
              bg={cardBg}
              {...cardStyles}
              alignItems="center"
              justifyContent="space-between"
              transition="all 0.2s ease"
              _hover={{
                bg: hoverBg,
                shadow: "md",
                transform: "scale(1.01)",
              }}
              minH="60px"
            >
              <HStack spacing={3}>
                <Avatar
                  name={student.name || "Anonymous"}
                  size="sm"
                  // bg={isTopRank ? "teal.400" : "gray.300"}
                />
                <VStack align="start" spacing={0}>
                  <Text
                    fontSize="sm"
                    fontWeight={isTopRank ? "bold" : "medium"}
                    color={isCurrentStudent ? "blue.600" : textColor}
                    noOfLines={1}
                  >
                    {student.name || "Anonymous"}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Total Marks: {ranking.totalMarks}
                  </Text>
                </VStack>
              </HStack>
              <HStack spacing={3}>
                {isTopRank && (
                  <Tooltip label={`Rank ${index + 1}`} aria-label="Trophy Tooltip">
                    <Icon as={FaTrophy} color="teal.400" w={5} h={5} />
                  </Tooltip>
                )}
                <Badge
                  fontSize="xs"
                  colorScheme={isCurrentStudent ? "blue" : "teal"}
                  variant={isTopRank ? "solid" : "subtle"}
                >
                  Rank {index + 1}
                </Badge>
              </HStack>
            </Flex>
          );
        })}
      </VStack>
    </Box>
  );
};

export default StudentRankings;
