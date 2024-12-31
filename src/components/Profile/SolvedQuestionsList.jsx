import React from "react";
import {
  Box,
  SimpleGrid,
  VStack,
  Text,
  Badge,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SolvedQuestionsList = ({ groupedRecords }) => {
  const navigate = useNavigate();

  return (
    <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
      {groupedRecords.map((group) => (
        <Box
          key={group.questionId}
          p={4}
          bg="white"
          borderRadius="md"
          border="1px solid"
          borderColor="teal.500"
          boxShadow="md"
          height="150px"
          width="200px"
          transition="transform 0.2s ease, box-shadow 0.2s ease"
          _hover={{
            transform: "scale(1.05)",
            boxShadow: "lg",
            bg: "teal.50",
          }}
          _dark={{
            bg: "gray.700",
            borderColor: "teal.300",
            _hover: { bg: "gray.600", boxShadow: "dark-lg" },
          }}
        >
          <VStack spacing={2} align="start" height="100%">
            <Text
              fontWeight="semibold"
              fontSize="sm"
              color="teal.800"
              _dark={{ color: "teal.200" }}
              noOfLines={1}
            >
              {group.title}
            </Text>
            <HStack spacing={2}>
              <Badge
                colorScheme={
                  group.difficultLevel === "HARD"
                    ? "red"
                    : group.difficultLevel === "MEDIUM"
                    ? "yellow"
                    : "green"
                }
                fontSize="xs"
              >
                {group.difficultLevel}
              </Badge>
              <Badge
                colorScheme={group.passed ? "green" : "red"}
                px={2}
                py={0.5}
                borderRadius="full"
                fontSize="xs"
              >
                {group.passed ? "PASSED" : "FAILED"}
              </Badge>
            </HStack>
            <Text
              fontSize="xs"
              color="gray.600"
              fontWeight="medium"
              _dark={{ color: "gray.300" }}
              noOfLines={1}
            >
              Tag:{" "}
              <Text as="span" color="teal.600">
                {group.tag}
              </Text>
            </Text>
            <HStack justify="space-between" w="full" mt="auto">
              <Text
                fontSize="xs"
                color="gray.500"
                _dark={{ color: "gray.400" }}
                fontWeight="medium"
              >
                Attempts: {group.attempts}
              </Text>
              <Button
                size="xs"
                colorScheme="teal"
                variant="solid"
                onClick={() => navigate(`/problem/${group.questionId}`)}
                _hover={{ bg: "teal.600", color: "white" }}
                borderRadius="full"
              >
                View
              </Button>
            </HStack>
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default React.memo(SolvedQuestionsList);
