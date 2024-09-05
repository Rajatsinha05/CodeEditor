import React from "react";
import { Box, Heading, SimpleGrid, Text, Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const StudentStats = ({ student }) => {
  return (
    <Box
      bg="gray.50"
      p={6}
      borderRadius="md"
      boxShadow="md"
      _dark={{ bg: "gray.700", boxShadow: "dark-lg" }}
    >
      <Heading size="md" mb={4} color="blue.600" _dark={{ color: "blue.300" }}>
        Solved Questions
      </Heading>
      {student.solvedQuestions && student.solvedQuestions.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {student.solvedQuestions.map((question) => (
            <ChakraLink
              as={Link}
              to={`/problem/${question.id}`}
              key={question.id}
              _hover={{ textDecoration: "none" }}
              _focus={{ boxShadow: "outline" }}
            >
              <Box
                p={4}
                bg="white"
                borderRadius="md"
                boxShadow="sm"
                _hover={{ bg: "blue.50", _dark: { bg: "blue.900" } }}
                _dark={{ bg: "gray.800", color: "gray.300", boxShadow: "dark-lg" }}
                transition="background 0.2s ease"
              >
                <Text
                  fontWeight="bold"
                  color="blue.800"
                  _dark={{ color: "blue.200" }}
                  isTruncated
                >
                  {question.title}
                </Text>
              </Box>
            </ChakraLink>
          ))}
        </SimpleGrid>
      ) : (
        <Text mt={3} color="gray.600" _dark={{ color: "gray.400" }}>
          No solved questions yet.
        </Text>
      )}
    </Box>
  );
};

export default StudentStats;
