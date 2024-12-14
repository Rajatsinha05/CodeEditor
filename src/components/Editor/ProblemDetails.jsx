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
  Stack,
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
  const { questionId, contestId, attemptId } = useParams();

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

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevQuestionId =
        contestQuestions[currentQuestionIndex - 1].questionId;
      navigate(
        `/contests/${contestId}/questions/${prevQuestionId}/attempts/${attemptId}`
      );
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < contestQuestions.length - 1) {
      const nextQuestionId =
        contestQuestions[currentQuestionIndex + 1].questionId;
      navigate(
        `/contests/${contestId}/questions/${nextQuestionId}/attempts/${attemptId}`
      );
    }
  };

  return (
    <Box
      p={{ base: 4, md: 6 }}
      borderRadius="lg"
      shadow="md"
      bg={boxBg}
      transition="all 0.3s ease"
      _hover={{ transform: "scale(1.01)", shadow: "lg" }}
    >
      <VStack align="stretch" spacing={6}>
        {/* Title and Navigation Section */}
        <Flex justify="space-between" align="center" pb={3} textAlign="center">
          {contest && (
            <IconButton
              aria-label="Previous Question"
              icon={<ArrowBackIcon />}
              onClick={handlePrevious}
              size="md"
              colorScheme="teal"
              variant="outline"
              isDisabled={currentQuestionIndex <= 0}
            />
          )}
          <Text
            fontSize={{ base: "lg", md: "2xl" }}
            fontWeight="bold"
            color={textColor}
            flex="1"
            mx={6} // Adjust spacing around the text for balance
          >
            {question?.title || "Problem Title"}
          </Text>
          {contest && (
            <IconButton
              aria-label="Next Question"
              icon={<ArrowForwardIcon />}
              onClick={handleNext}
              size="md"
              colorScheme="teal"
              variant="outline"
              isDisabled={currentQuestionIndex >= contestQuestions.length - 1}
            />
          )}
        </Flex>

      
        {/* Description Section */}
        <Box
          bg={sectionBg}
          p={{ base: 4, md: 6 }}
          borderRadius="md"
          shadow="sm"
          border={`1px solid ${borderColor}`}
        >
          <Text fontWeight="medium" mb={4} color={textColor}>
            Description:
          </Text>
          <Box
            mt={2}
            color={textColor}
            dangerouslySetInnerHTML={{
              __html: question?.description || "No description provided.",
            }}
          />
        </Box>

        {/* Input/Output Boxes */}
        <Stack spacing={4}>
          <Box
            bg={sectionBg}
            p={4}
            borderRadius="md"
            shadow="sm"
            border={`1px solid ${borderColor}`}
            flex="1"
          >
            <Text fontWeight="bold" mb={2} color={textColor}>
              Input:
            </Text>
            <Text>{question?.input || "Input format not provided."}</Text>
          </Box>
          <Box
            bg={sectionBg}
            p={4}
            borderRadius="md"
            shadow="sm"
            border={`1px solid ${borderColor}`}
            flex="1"
          >
            <Text fontWeight="bold" mb={2} color={textColor}>
              Expected Output:
            </Text>
            <Text>
              {question?.expectedOutput || "Output format not provided."}
            </Text>
          </Box>
        </Stack>

        {/* Examples Section */}
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
                  <Divider my={2} />
                  <Text>
                    <strong>Output:</strong> {example.output || "N/A"}
                  </Text>
                  <Divider my={2} />
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
