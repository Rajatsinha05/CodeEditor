import React from "react";
import {
  VStack,
  Text,
  Box,
  Tag,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";

const ProblemDetails = ({ question }) => {
  const boxBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const textColor = useColorModeValue("gray.800", "gray.200");

  return (
    <Box
      p={6}
      // bg={boxBg}
      borderRadius="lg"
      shadow="lg"
      border={`1px solid ${borderColor}`}
      w="100%"
    >
      <VStack align="stretch" spacing={4}>
        {/* Title */}
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          {question?.title}
        </Text>

        {/* Description */}
        <Text fontWeight="semibold" color={textColor}>
          {question?.description}
        </Text>

        {/* Difficulty Tag */}
        <Tag
          size="lg"
          colorScheme={
            question?.difficultLevel === "EASY"
              ? "green"
              : question?.difficultLevel === "MEDIUM"
              ? "yellow"
              : "red"
          }
          w="fit-content"
        >
          Difficulty: {question?.difficultLevel}
        </Tag>

        {/* Input */}
        <Box>
          <Text fontWeight="bold" mb={2}>
            Input:
          </Text>
          <Box
            bg={boxBg}
            p={3}
            borderRadius="md"
            border={`1px solid ${borderColor}`}
          >
            <Text>{question?.input}</Text>
          </Box>
        </Box>

        {/* Expected Output */}
        <Box>
          <Text fontWeight="bold" mb={2}>
            Expected Output:
          </Text>
          <Box
            bg={boxBg}
            p={3}
            borderRadius="md"
            border={`1px solid ${borderColor}`}
          >
            <Text whiteSpace="pre-wrap">{question?.expectedOutput}</Text>
          </Box>
        </Box>

        {/* Examples */}
        {question?.examples?.length > 0 && (
          <Box>
            <Text fontWeight="bold" mb={2}>
              Examples:
            </Text>
            {question.examples.map((example, index) => (
              <Box
                key={index}
                p={3}
                borderWidth={1}
                borderColor={borderColor}
                borderRadius="md"

                mb={4}
              >
                <Text>
                  <strong>Input:</strong> {example.input}
                </Text>
                <Text>
                  <strong>Output:</strong> {example.output}
                </Text>
                <Text>
                  <strong>Explanation:</strong> {example.explanation}
                </Text>
              </Box>
            ))}
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default ProblemDetails