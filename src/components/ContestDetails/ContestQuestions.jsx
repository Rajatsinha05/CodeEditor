import React from "react";
import {
  Box,
  VStack,
  Text,
  HStack,
  Button,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const ContestQuestions = ({
  contest,
  solvedQuestions,
  user,
  colorMode,
  setElapsedTime,
}) => {
  const navigate = useNavigate(); // Create the navigate function here

  const handleAttemptQuestion = (questionId) => {
   

    navigate(`/contest/${contest.id}/attempt/${questionId}`); // Use the navigate function
  };

  return (
    <Box my={6}>
      <Text
        fontSize="lg"
        fontWeight="semibold"
        mb={4}
        color={colorMode === "light" ? "teal.600" : "teal.300"}
      >
        Questions
      </Text>
      <VStack spacing={4} align="stretch">
        {contest?.contestQuestions?.map((question) => {
          const solvedQuestion = solvedQuestions.find(
            (q) =>
              q.studentId.toString() === user.id.toString() &&
              q.questionId === question.questionId &&
              q.contestId === contest.id
          );

          let solvedStatus = null;
          let obtainedMarks = 0;
          if (solvedQuestion) {
            obtainedMarks = solvedQuestion.obtainedMarks;
            if (obtainedMarks === question.marks) {
              solvedStatus = "solved"; // 100% marks
            } else if (obtainedMarks > 0) {
              solvedStatus = "partial"; // Partial marks
            } else {
              solvedStatus = "failed"; // 0 marks
            }
          }

          return (
            <Box
              key={question.questionId}
              p={4}
              bg={
                solvedStatus === "solved"
                  ? "green.200"
                  : solvedStatus === "partial"
                  ? "yellow.100"
                  : solvedStatus === "failed"
                  ? "red.200"
                  : colorMode === "light"
                  ? "white"
                  : "gray.700"
              }
              borderRadius="md"
              shadow="sm"
              _hover={{
                bg: colorMode === "light" ? "teal.50" : "teal.900",
              }}
            >
              <HStack justify="space-between" align="center">
                <Text
                  fontSize="md"
                  color={
                    solvedStatus === "solved"
                      ? "green.700"
                      : solvedStatus === "partial"
                      ? "orange.700"
                      : solvedStatus === "failed"
                      ? "red.700"
                      : colorMode === "light"
                      ? "blue.600"
                      : "blue.300"
                  }
                  fontWeight="medium"
                >
                  {question.title} (Total Marks: {question.marks})
                </Text>
                <HStack>
                  {solvedStatus && (
                    <Badge
                      colorScheme={
                        solvedStatus === "solved"
                          ? "green"
                          : solvedStatus === "partial"
                          ? "orange"
                          : "red"
                      }
                      variant="solid"
                      px={2}
                    >
                      Marks Obtained: {obtainedMarks} / {question.marks}
                    </Badge>
                  )}

                  <Tooltip
                    label="Attempt Question"
                    aria-label="Attempt Question"
                  >
                    <Button
                      size="sm"
                      colorScheme="teal"
                      variant="ghost"
                      onClick={() => handleAttemptQuestion(question.questionId)}
                      leftIcon={<ArrowForwardIcon />}
                    >
                      Start
                    </Button>
                  </Tooltip>
                </HStack>
              </HStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

export default ContestQuestions;
