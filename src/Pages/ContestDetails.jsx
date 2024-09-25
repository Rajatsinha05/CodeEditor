import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  VStack,
  Divider,
  HStack,
  Badge,
  Avatar,
  Icon,
  Button,
  useColorMode,
  Flex,
  Tag,
} from "@chakra-ui/react";
import { CalendarIcon, TimeIcon } from "@chakra-ui/icons";
import { getContestById } from "../redux/contestapislice";

const ContestDetails = () => {
  const { id } = useParams(); // Get contest ID from the URL
  const dispatch = useDispatch();
  const navigate = useNavigate(); // For navigation
  const { colorMode } = useColorMode(); // For light/dark mode

  // Fetch contest details when component mounts
  useEffect(() => {
    if (id) {
      dispatch(getContestById(id));
    }
  }, [dispatch, id]);

  // Get the specific contest from the store
  const { contest } = useSelector((store) => store.contestApi);

  const formatDateTime12Hour = (dateString) => {
    if (!dateString) return "";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  // Handle navigation to question attempt page
  const handleAttemptQuestion = (questionId) => {
    navigate(`/contest/${id}/attempt/${questionId}`);
  };

  return (
    <Box
      p={8}
      maxW="1000px"
      mx="auto"
      bg={colorMode === "light" ? "gray.100" : "gray.800"}
      borderRadius="lg"
      shadow="lg"
    >
      <Flex justify="space-between" align="center" mb={6}>
        <Text
          fontSize="3xl"
          fontWeight="bold"
          color={colorMode === "light" ? "teal.600" : "teal.300"}
        >
          {contest?.title || "Contest Details"}
        </Text>
      </Flex>

      <Box mb={6}>
        <Badge colorScheme="purple" fontSize="0.8em" p={1} borderRadius="md">
          Difficulty: {contest?.difficultyLevel || "N/A"}
        </Badge>
      </Box>

      <HStack mb={6} spacing={4}>
        <HStack>
          <Icon
            as={CalendarIcon}
            color={colorMode === "light" ? "gray.500" : "gray.400"}
          />
          <Text
            fontSize="md"
            color={colorMode === "light" ? "gray.600" : "gray.400"}
          >
            Starts: {formatDateTime12Hour(contest?.startTime)}
          </Text>
        </HStack>
        <HStack>
          <Icon
            as={TimeIcon}
            color={colorMode === "light" ? "gray.500" : "gray.400"}
          />
          <Text
            fontSize="md"
            color={colorMode === "light" ? "gray.600" : "gray.400"}
          >
            Ends: {formatDateTime12Hour(contest?.endTime)}
          </Text>
        </HStack>
      </HStack>

      <Box mb={6}>
        <Text
          fontSize="lg"
          fontWeight="bold"
          color={colorMode === "light" ? "gray.700" : "gray.300"}
        >
          Total Marks: {contest?.totalMarks || "N/A"}
        </Text>
      </Box>

      <Divider borderColor={colorMode === "light" ? "gray.300" : "gray.600"} />

      <Box my={6}>
        <Text
          fontSize="lg"
          fontWeight="semibold"
          mb={2}
          color={colorMode === "light" ? "gray.700" : "gray.300"}
        >
          Description
        </Text>
        <Text
          fontSize="md"
          color={colorMode === "light" ? "gray.600" : "gray.400"}
        >
          {contest?.description || "No description available."}
        </Text>
      </Box>

      <Divider borderColor={colorMode === "light" ? "gray.300" : "gray.600"} />

      {/* Contest Questions */}
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
          {contest?.contestQuestions?.length > 0 ? (
            contest.contestQuestions.map((question) => (
              <Box
                key={question.questionId}
                p={4}
                bg={colorMode === "light" ? "white" : "gray.700"}
                borderRadius="md"
                shadow="sm"
                _hover={{ bg: colorMode === "light" ? "teal.50" : "teal.900" }}
              >
                <Text
                  fontSize="md"
                  color={colorMode === "light" ? "blue.600" : "blue.300"}
                  fontWeight="medium"
                >
                  {question.title} - {question.marks} Marks
                </Text>
                <Button
                  size="sm"
                  colorScheme="teal"
                  mt={2}
                  onClick={() => handleAttemptQuestion(question.questionId)}
                >
                  Attempt Question
                </Button>
              </Box>
            ))
          ) : (
            <Text>No questions available for this contest.</Text>
          )}
        </VStack>
      </Box>

      <Divider borderColor={colorMode === "light" ? "gray.300" : "gray.600"} />

      {/* Enrolled Students */}
      <Box my={6}>
        <Text
          fontSize="lg"
          fontWeight="semibold"
          mb={4}
          color={colorMode === "light" ? "teal.600" : "teal.300"}
        >
          Enrolled Students
        </Text>
        <VStack spacing={4} align="stretch">
          {contest?.enrolledStudents?.length > 0 ? (
            contest.enrolledStudents.map((student) => (
              <HStack
                key={student.id}
                p={4}
                bg={colorMode === "light" ? "white" : "gray.700"}
                borderRadius="md"
                shadow="sm"
                _hover={{ bg: colorMode === "light" ? "gray.100" : "gray.600" }}
                justifyContent="space-between"
              >
                <HStack spacing={3}>
                  <Avatar name={student?.name} size="sm" />
                  <Text
                    fontSize="md"
                    color={colorMode === "light" ? "gray.700" : "gray.300"}
                    fontWeight="medium"
                  >
                    {student?.name}
                  </Text>
                  <Tag size="sm" colorScheme="blue">
                    {student?.email}
                  </Tag>
                </HStack>
                <Button size="sm" colorScheme="teal" variant="outline">
                  View Profile
                </Button>
              </HStack>
            ))
          ) : (
            <Text>No students enrolled in this contest.</Text>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default ContestDetails;
