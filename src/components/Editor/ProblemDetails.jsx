import React, { useEffect } from "react";
import {
  VStack,
  Text,
  Box,
  Tag,
  useColorModeValue,
  Divider,
  Flex,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchContests } from "../../redux/contestSlice";

const ProblemDetails = ({ question }) => {
  const boxBg = useColorModeValue("gray.50", "gray.800");
  const sectionBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const { contests } = useSelector((store) => store.contest);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { questionId, contestId } = useParams();

  useEffect(() => {
    if (contestId && contests.length === 0) {
      dispatch(fetchContests());
    }
  }, [dispatch, contestId, contests.length]);

  const contest = contestId
    ? contests.find((con) => con.id == contestId)
    : null;
  const contestQuestions = contest?.contestQuestions || [];
  const currentQuestionIndex = contestQuestions.findIndex(
    (q) => q.questionId == questionId
  );

  const currentQuestion = contestQuestions[currentQuestionIndex];

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevQuestionId =
        contestQuestions[currentQuestionIndex - 1].questionId;
      navigate(`/contest/${contestId}/attempt/${prevQuestionId}`);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < contestQuestions.length - 1) {
      const nextQuestionId =
        contestQuestions[currentQuestionIndex + 1].questionId;
      navigate(`/contest/${contestId}/attempt/${nextQuestionId}`);
    }
  };

  return (
    <Box
      p={6}
      borderRadius="md"
      shadow="base"
      border={`1px solid ${borderColor}`}
      bg={boxBg}
      _hover={{ transform: "scale(1.01)", shadow: "lg" }}
      transition="all 0.3s ease"
    >
      <VStack align="stretch" spacing={6}>
        {/* Conditionally show navigation buttons only if contestId exists */}
        {contestId && (
          <HStack justify="space-between">
            <IconButton
              aria-label="Previous Question"
              icon={<ArrowBackIcon />}
              onClick={handlePrevious}
              size="md"
              colorScheme="teal"
              variant="outline"
              isDisabled={currentQuestionIndex <= 0}
            />
            <IconButton
              aria-label="Next Question"
              icon={<ArrowForwardIcon />}
              onClick={handleNext}
              size="md"
              colorScheme="teal"
              variant="outline"
              isDisabled={currentQuestionIndex >= contestQuestions.length - 1}
            />
          </HStack>
        )}
        <Flex
          justify="space-between"
          align="center"
          pb={3}
          borderBottom={`1px solid ${borderColor}`}
        >
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            {question?.title || "Problem Title"}
          </Text>
          <Tag
            size="md"
            colorScheme={
              question?.difficultLevel === "EASY"
                ? "green"
                : question?.difficultLevel === "MEDIUM"
                ? "yellow"
                : "red"
            }
          >
            {question?.difficultLevel || "N/A"}
          </Tag>
        </Flex>
        <Box>
          <Text fontSize="lg" fontWeight="medium" color={textColor}>
            Description:
          </Text>
          <Text mt={2} color={textColor}>
            {question?.description || "Problem description goes here..."}
          </Text>
        </Box>
        <Box
          bg={sectionBg}
          p={4}
          borderRadius="md"
          shadow="sm"
          border={`1px solid ${borderColor}`}
        >
          <Text fontWeight="bold" mb={2} color={textColor}>
            Input:
          </Text>
          <Text>{question?.input || "Input format is not provided."}</Text>
        </Box>
        <Box
          bg={sectionBg}
          p={4}
          borderRadius="md"
          shadow="sm"
          border={`1px solid ${borderColor}`}
        >
          <Text fontWeight="bold" mb={2} color={textColor}>
            Expected Output:
          </Text>
          <Text>
            {question?.expectedOutput || "Output format is not provided."}
          </Text>
        </Box>
        {question?.examples?.length > 0 ? (
          <Box>
            <Text fontWeight="bold" mb={2} color={textColor}>
              Examples:
            </Text>
            <VStack align="stretch" spacing={4}>
              {question.examples.map((example, index) => (
                <Box
                  key={index}
                  bg={sectionBg}
                  p={4}
                  borderRadius="md"
                  shadow="sm"
                  border={`1px solid ${borderColor}`}
                >
                  <Text>
                    <strong>Input:</strong> {example.input || "N/A"}
                  </Text>
                  <Divider my={2} borderColor={borderColor} />
                  <Text>
                    <strong>Output:</strong> {example.output || "N/A"}
                  </Text>
                  <Divider my={2} borderColor={borderColor} />
                  <Text>
                    <strong>Explanation:</strong> {example.explanation || "N/A"}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>
        ) : (
          <Box
            bg={sectionBg}
            p={4}
            borderRadius="md"
            shadow="sm"
            border={`1px solid ${borderColor}`}
          >
            <Text fontWeight="semibold" color="red.500">
              No examples are available for this problem.
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default React.memo(ProblemDetails);
