import React from "react";
import { Box, VStack, Text, HStack, Avatar, Icon, Tag, Tooltip } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

const StudentRankings = ({ studentRankings, contest, user, colorMode }) => (
  <Box my={6}>
    <Text fontSize="lg" fontWeight="semibold" mb={4} color={colorMode === "light" ? "teal.600" : "teal.300"}>
      Student Rankings
    </Text>
    <VStack spacing={4} align="stretch">
      {studentRankings.map((ranking, index) => {
        const student = contest.enrolledStudents.find(
          (s) => s.id.toString() === ranking.studentId
        );
        if (!student) {
          return null; // Skip if student is not found
        }
        const isCurrentStudent = student.id.toString() === user.id.toString();
        return (
          <HStack
            key={ranking.studentId}
            p={4}
            bg={isCurrentStudent ? "blue.600" : colorMode === "light" ? "white" : "gray.700"}
            borderRadius="md"
            shadow="sm"
            _hover={{
              bg: colorMode === "light" ? "gray.100" : "gray.600",
            }}
            justifyContent="space-between"
          >
            <HStack spacing={3}>
              <Avatar name={student.name} size="sm" />
              <Text
                fontSize="md"
                color={
                  isCurrentStudent
                    ? "yellow.300"
                    : colorMode === "light"
                    ? "gray.700"
                    : "gray.300"
                }
                fontWeight="medium"
              >
                {student.name} - Rank {index + 1}
              </Text>
              <Tag size="sm" colorScheme="blue">
                Total Marks: {ranking.totalMarks}
              </Tag>
            </HStack>
            <Tooltip label={"Rank"  } aria-label="Rank One">
              <Icon as={StarIcon} color={index === 0 ? "yellow.400" : "gray.400"} />
            </Tooltip>
          </HStack>
        );
      })}
    </VStack>
  </Box>
);

export default StudentRankings;
