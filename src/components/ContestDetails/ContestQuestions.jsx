import React, { useMemo, useCallback } from "react";
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
  attemptId,
}) => {
  const navigate = useNavigate();

  // Memoize solved questions for performance
  const solvedQuestionsMap = useMemo(() => {
    return solvedQuestions.reduce((acc, question) => {
      if (question.studentId.toString() === user.id.toString()) {
        acc[question.questionId] = question;
      }
      return acc;
    }, {});
  }, [solvedQuestions, user.id]);

  // Callback for navigation
  const handleAttemptQuestion = useCallback(
    (questionId) => {
      navigate(
        `/contests/${contest.id}/questions/${questionId}/attempts/${attemptId}`
      );
    },
    [navigate, contest.id, attemptId]
  );

  // Dynamic styles
  const getBackgroundColor = (solvedStatus) => {
    if (solvedStatus === "solved") return "green.200";
    if (solvedStatus === "partial") return "yellow.100";
    if (solvedStatus === "failed") return "red.200";
    return colorMode === "light" ? "white" : "gray.700";
  };

  const getTextColor = (solvedStatus) => {
    if (solvedStatus === "solved") return "green.700";
    if (solvedStatus === "partial") return "orange.700";
    if (solvedStatus === "failed") return "red.700";
    return colorMode === "light" ? "blue.600" : "blue.300";
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
          const solvedQuestion = solvedQuestionsMap[question.questionId];
          let solvedStatus = null;
          let obtainedMarks = 0;

          if (solvedQuestion) {
            obtainedMarks = solvedQuestion.obtainedMarks;
            solvedStatus =
              obtainedMarks === question.marks
                ? "solved"
                : obtainedMarks > 0
                ? "partial"
                : "failed";
          }

          return (
            <Box
              key={question.questionId}
              p={4}
              bg={getBackgroundColor(solvedStatus)}
              borderRadius="md"
              shadow="sm"
              _hover={{
                bg: colorMode === "light" ? "teal.50" : "teal.900",
              }}
            >
              <HStack justify="space-between" align="center">
                <Text
                  fontSize="md"
                  color={getTextColor(solvedStatus)}
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

export default React.memo(ContestQuestions);
