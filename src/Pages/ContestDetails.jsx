import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getContestById } from "../redux/contestSlice";
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
  Tooltip,
  Tag,
} from "@chakra-ui/react";
import { CalendarIcon, TimeIcon, ArrowForwardIcon, StarIcon } from "@chakra-ui/icons";
import { MdTimer, MdAdminPanelSettings, MdCheckCircle, MdWarning, MdError } from "react-icons/md";
import dayjs from "dayjs";
import { fetchSolvedQuestionsByContestId } from "../redux/QuestionSolvedSplice";
import { groupBy } from "lodash";

const ContestDetails = () => {
  const { id } = useParams(); // Get contest ID from the URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { colorMode } = useColorMode(); // For light/dark mode
  const [elapsedTime, setElapsedTime] = useState({}); // State to track the time taken for each question

  useEffect(() => {
    dispatch(fetchSolvedQuestionsByContestId(id));
  }, [dispatch, id]);

  // Fetch contest details when component mounts
  useEffect(() => {
    dispatch(getContestById(id));
  }, [dispatch, id]);

  // Get solved questions and contest details from the store
  const { solvedQuestions } = useSelector((store) => store.solved);
  const { contest } = useSelector((store) => store.contest);
  const { user } = useSelector((store) => store.data); // Assuming user data is stored in data slice

  // Group solved questions by studentId and calculate the total obtained marks
  const groupedByStudent = groupBy(solvedQuestions, "studentId");
  const studentRankings = Object.keys(groupedByStudent).map((studentId) => {
    const totalMarks = groupedByStudent[studentId]?.reduce(
      (acc, curr) => acc + curr.obtainedMarks,
      0
    );
    return {
      studentId,
      totalMarks,
    };
  });

  // Sort rankings in descending order based on total obtained marks
  studentRankings.sort((a, b) => b.totalMarks - a.totalMarks);

  // Format date/time in a readable format
  const formatDateTime12Hour = (dateString) => {
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

  // Handle attempt question navigation and start timer
  const handleAttemptQuestion = (questionId) => {
    const startTime = dayjs();
    setElapsedTime((prev) => ({
      ...prev,
      [questionId]: startTime,
    }));
    navigate(`/contest/${id}/attempt/${questionId}`);
  };

  // Calculate the time taken for each question
  const getElapsedTime = (startTime) => {
    if (!startTime) return "0s";
    const now = dayjs();
    const diff = now.diff(startTime);
    const duration = dayjs.duration(diff);
    return `${duration.minutes()}m ${duration.seconds()}s`;
  };

  // Update elapsed time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        const newElapsedTime = {};
        for (const questionId in prev) {
          newElapsedTime[questionId] = prev[questionId];
        }
        return newElapsedTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      p={8}
      maxW="1000px"
      mx="auto"
      bg={colorMode === "light" ? "gray.100" : "gray.800"}
      borderRadius="lg"
      shadow="lg"
    >
      {/* Header with theme toggle button */}
      <Flex justify="space-between" align="center" mb={6}>
        <Text
          fontSize="3xl"
          fontWeight="bold"
          color={colorMode === "light" ? "teal.600" : "teal.300"}
        >
          {contest?.title}
        </Text>
      </Flex>

      {/* Contest Difficulty Level */}
      {contest?.difficultyLevel && (
        <Box mb={6}>
          <Badge colorScheme="purple" fontSize="0.8em" p={1} borderRadius="md">
            Difficulty: {contest.difficultyLevel}
          </Badge>
        </Box>
      )}

      {/* Contest Dates */}
      {contest?.startTime && contest?.endTime && (
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
              Starts: {formatDateTime12Hour(contest.startTime)}
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
              Ends: {formatDateTime12Hour(contest.endTime)}
            </Text>
          </HStack>
        </HStack>
      )}

      {/* Total Marks */}
      {contest?.totalMarks && (
        <Box mb={6}>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={colorMode === "light" ? "gray.700" : "gray.300"}
          >
            Total Marks: {contest.totalMarks}
          </Text>
        </Box>
      )}

      <Divider borderColor={colorMode === "light" ? "gray.300" : "gray.600"} />

      {/* Contest Description */}
      {contest?.description && (
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
            {contest.description}
          </Text>
        </Box>
      )}

      <Divider borderColor={colorMode === "light" ? "gray.300" : "gray.600"} />

      {/* Contest Questions */}
      {contest?.contestQuestions?.length > 0 && (
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
            {contest.contestQuestions.map((question) => {
              // Find the solved question for the current student and this question
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
                if (solvedQuestion.obtainedMarks === question.marks) {
                  solvedStatus = "solved"; // 100% marks
                } else if (solvedQuestion.obtainedMarks > 0) {
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
                      {/* Display marks obtained for each question */}
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
                          textColor={
                            solvedStatus === "solved"
                              ? "green.800"
                              : solvedStatus === "partial"
                              ? "orange.800"
                              : "red.800"
                          }
                        >
                          Marks Obtained: {obtainedMarks} / {question.marks}
                        </Badge>
                      )}

                      <Tooltip label="Time Taken" aria-label="Time Taken">
                        <HStack>
                          <Icon
                            as={MdTimer}
                            color={
                              colorMode === "light" ? "gray.600" : "gray.400"
                            }
                          />
                          <Text
                            fontSize="sm"
                            color={
                              colorMode === "light" ? "gray.600" : "gray.400"
                            }
                          >
                            {getElapsedTime(elapsedTime[question.questionId])}
                          </Text>
                        </HStack>
                      </Tooltip>
                      {solvedStatus === "solved" && (
                        <Tooltip label="Solved" aria-label="Solved">
                          <Icon
                            as={MdCheckCircle}
                            color="green.500"
                            boxSize={5}
                          />
                        </Tooltip>
                      )}
                      {solvedStatus === "partial" && (
                        <Tooltip label="Partially Completed" aria-label="Partially Completed">
                          <Icon
                            as={MdWarning}
                            color="orange.500"
                            boxSize={5}
                          />
                        </Tooltip>
                      )}
                      {solvedStatus === "failed" && (
                        <Tooltip label="Not Solved (0 Marks)" aria-label="Not Solved">
                          <Icon
                            as={MdError}
                            color="red.500"
                            boxSize={5}
                          />
                        </Tooltip>
                      )}
                      <Tooltip label="Attempt Question" aria-label="Attempt Question">
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
      )}

      <Divider borderColor={colorMode === "light" ? "gray.300" : "gray.600"} />

      {/* Student Rankings */}
      {studentRankings.length > 0 && contest?.enrolledStudents?.length > 0 && (
        <Box my={6}>
          <Text
            fontSize="lg"
            fontWeight="semibold"
            mb={4}
            color={colorMode === "light" ? "teal.600" : "teal.300"}
          >
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
                  bg={
                    isCurrentStudent
                      ? "blue.600"
                      : colorMode === "light"
                      ? "white"
                      : "gray.700"
                  }
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
                  <Tooltip label="Rank One" aria-label="Rank One">
                    <Icon
                      as={StarIcon}
                      color={index === 0 ? "yellow.400" : "gray.400"}
                    />
                  </Tooltip>
                </HStack>
              );
            })}
          </VStack>
        </Box>
      )}

      {/* Enrolled Students (only for ADMIN and SUPERADMIN) */}
      {(user.role === "ADMIN" || user.role === "SUPERADMIN") &&
        contest?.enrolledStudents?.length > 0 && (
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
              {contest.enrolledStudents.map((student) => (
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
                    <Avatar name={student.name} size="sm" />
                    <Text
                      fontSize="md"
                      color={colorMode === "light" ? "gray.700" : "gray.300"}
                      fontWeight="medium"
                    >
                      {student.name}
                    </Text>
                    <Tag size="sm" colorScheme="blue">
                      {student.email}
                    </Tag>
                  </HStack>
                  <Tooltip label="Admin Access" aria-label="Admin Access">
                    <Icon as={MdAdminPanelSettings} color="teal.500" />
                  </Tooltip>
                </HStack>
              ))}
            </VStack>
          </Box>
        )}
    </Box>
  );
};

export default ContestDetails;
