import React from "react";
import {
  Box,
  Heading,
  Divider,
  VStack,
  Flex,
  List,
  ListItem,
  Badge,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const ProjectResult = ({ results, onFailedTestClick }) => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.700", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box>
      <Heading size="md" mb={6} color={textColor}>
        Results Overview
      </Heading>
      <Divider mb={4} />
      <VStack spacing={6} align="stretch">
        {results.map((result) => (
          <Box
            key={result.id}
            p={6}
            bg={bgColor}
            rounded="lg"
            shadow="md"
            w="full"
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.600")}
          >
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontWeight="bold" fontSize="lg" color={textColor}>
                {result.name} ({result.email})
              </Text>
              <Badge
                colorScheme={result.status === "PASSED" ? "green" : "red"}
                fontSize="lg"
                px={3}
                py={1}
              >
                {result.status}
              </Badge>
            </Flex>
            <Divider mb={4} />
            <Flex justify="space-between" gap={4} flexWrap="wrap">
              {/* Passed Tests */}
              <Box flex="1" minW="200px">
                <Heading size="sm" mb={2} color="green.500">
                  <Icon as={FiCheckCircle} mr={2} />
                  Passed Tests
                </Heading>
                <List spacing={2}>
                  {result.passedTests?.length ? (
                    result.passedTests.map((test, idx) => (
                      <ListItem key={idx} fontSize="sm" color="green.700">
                        {test}
                      </ListItem>
                    ))
                  ) : (
                    <Text fontSize="sm" color={subTextColor}>
                      No passed tests.
                    </Text>
                  )}
                </List>
              </Box>
              {/* Failed Tests */}
              <Box flex="1" minW="200px">
                <Heading size="sm" mb={2} color="red.500">
                  <Icon as={FiXCircle} mr={2} />
                  Failed Tests
                </Heading>
                <List spacing={2}>
                  {result.failedTestsWithReasons?.length ? (
                    result.failedTestsWithReasons.map((test, idx) => (
                      <ListItem
                        key={idx}
                        fontSize="sm"
                        color="red.700"
                        cursor="pointer"
                        _hover={{ textDecoration: "underline" }}
                        onClick={() => onFailedTestClick(test)}
                      >
                        {test.testName}
                      </ListItem>
                    ))
                  ) : (
                    <Text fontSize="sm" color={subTextColor}>
                      No failed tests.
                    </Text>
                  )}
                </List>
              </Box>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default ProjectResult;
