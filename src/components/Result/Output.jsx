import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Text,
  Input,
  useToast,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  Spinner,
  VStack,
  HStack,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { executeCode, getCodeResult } from "../../api";
import Cookie from "js-cookie";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  saveOrUpdateSolvedQuestion,
  updateObtainedMarks,
} from "../../redux/QuestionSolvedSplice";
import { MdTimer } from "react-icons/md";
import TimerDisplay from "./TimerDisplay";
import { getContestById } from "../../redux/contestSlice";
import { showToast } from "../../utils/toastUtils";

const Output = ({
  editorRef,
  language,
  inputData = "",
  expectedOutput = "",
  type,
}) => {
  const toast = useToast();
  const dispatch = useDispatch();

  // Selectors at the top level
  const { questionId, contestId } = useParams();
  const { user, contest, solvedQuestions } = useSelector((store) => ({
    user: store.data.user,
    contest: store.contest.contest,
    solvedQuestions: store.solved.solvedQuestions,
  }));
  const studentId = user?.id;
  useEffect(() => {
    if (contestId && !contest) {
      dispatch(getContestById(contestId));
    }
  }, [contestId, contest, dispatch]);
  // State management
  const [output, setOutput] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [token, setToken] = useState("");
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    const fetchedToken = Cookie.get("token");
    setToken(fetchedToken || "");
  }, []);

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setInput((prevInput) => `${prevInput}\n`);
    }
  }, []);

  const runCode = useCallback(async () => {
    if (!editorRef?.current) {
      showToast(toast, "Editor is not ready. Please wait.", "warning");
      return;
    }

    const sourceCode = editorRef.current.getValue();
    if (!sourceCode.trim()) {
      showToast(toast, "Enter code to run.", "warning");
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setOutput(null);

    try {
      const res = await executeCode(language, sourceCode, input.trim());

      const result = await getCodeResult(res.requestId);

      const resultOutput =
        result.output?.split("\n").filter((line) => line.trim() !== "") || [];

      setOutput(resultOutput);
      setIsError(!!result.stderr);

      if (result.stderr) {
        showToast(toast, result.stderr, "error", 6000);
      }
    } catch (error) {
      showToast(toast, error.message || "Execution failed", "error", 6000);
    } finally {
      setIsLoading(false);
    }
  }, [editorRef, language, input, toast]);

  const submitCode = useCallback(async () => {
    if (!editorRef?.current) {
      showToast(toast, "Editor is not ready. Please wait.", "warning");
      return;
    }

    const sourceCode = editorRef.current.getValue();
    if (!sourceCode.trim()) {
      showToast(toast, "Enter code to submit.", "warning");
      return;
    }

    if (!questionId || !studentId) {
      showToast(toast, "Invalid question or user information.", "error");
      return;
    }

    // Check if the contest is currently active
    const currentTime = new Date();
    const contestStartTime = new Date(contest?.startTime);
    const contestEndTime = new Date(contest?.endTime);
    if (currentTime < contestStartTime || currentTime > contestEndTime) {
      showToast(toast, "Contest not active.", "error");
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setTestResults([]);
    setOutput(null);

    try {
      const res = await executeCode(language, sourceCode, inputData.trim());

      const result = await getCodeResult(res.requestId);

      const resultOutput =
        result.output?.split("\n").filter((line) => line.trim() !== "") || [];

      setOutput(resultOutput);
      // showToast(toast, "Code executed successfully", "success", 6000);
      const expectedOutputs = expectedOutput
        .split("\n")
        .filter((line) => line.trim() !== "");

      // Ensure both arrays have the same length
      const totalTests = Math.max(resultOutput.length, expectedOutputs.length);

      // Determine if each test case passes
      const results = Array.from({ length: totalTests }, (_, index) => ({
        output: resultOutput[index] || "null",
        expected: expectedOutputs[index] || "null",
        passed: resultOutput[index] === expectedOutputs[index],
      }));

      setTestResults(results);

      // Calculate the number of passed test cases
      const passedTests = results.filter((test) => test.passed).length;

      const percentagePassed = (passedTests / totalTests) * 100;

      // Get marks from contest question and calculate obtained marks
      if (contestId) {
        const marks = contest?.contestQuestions.find(
          (que) => que.questionId == questionId
        );
        const totalMarks = marks?.marks || 0;
        const obtainedMarks = Math.round((percentagePassed / 100) * totalMarks);

        // Check if this question has already been solved by this student in this contest
        const existingSolvedQuestion = solvedQuestions.find(
          (sq) =>
            sq.questionId == questionId &&
            sq.contestId == contestId &&
            sq.studentId == studentId
        );

        try {
          if (existingSolvedQuestion) {
            // Compare current obtained marks with previous marks
            if (existingSolvedQuestion.obtainedMarks >= obtainedMarks) {
              showToast(
                toast,
                `Your previous score of ${existingSolvedQuestion.obtainedMarks} is higher or equal to the current score of ${obtainedMarks}.`,
                "info",
                5000
              );
              setIsLoading(false);
              return; // Do not update if the previous marks are greater or equal
            }

            // Update obtained marks if the current obtained marks are higher
            await dispatch(
              updateObtainedMarks({
                id: existingSolvedQuestion.id,
                questionId,
                contestId,
                studentId,
                obtainedMarks,
                contestQuestionId: marks?.id || 1,
              })
            ).unwrap(); // Ensure that errors are caught
          } else {
            // Save or create new solved question if no previous record exists
            await dispatch(
              saveOrUpdateSolvedQuestion({
                questionId,
                contestId,
                studentId,
                obtainedMarks,
                contestQuestionId: marks?.id || 1,
              })
            ).unwrap();
          }

          showToast(
            toast,
            `You have obtained ${obtainedMarks} out of ${totalMarks} marks.`,
            "success",
            6000
          );
        } catch (error) {
          showToast(
            toast,
            error.message ||
              "Something went wrong while saving the submission.",
            "error",
            6000
          );
        }

        setIsError(!!result.stderr);
      }
    } catch (error) {
      showToast(toast, error.message || "Unable to submit code", "error", 6000);
    } finally {
      setIsLoading(false);
      setIsDrawerOpen(true);
    }
  }, [
    editorRef,
    language,
    inputData,
    expectedOutput,
    questionId,
    contest,
    contestId,
    studentId,
    solvedQuestions,
    dispatch,
    toast,
  ]);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  return (
    <Box w="100%" h="fit-content" p={4}>
      <Text mb={2} fontSize="lg">
        Output
      </Text>
      <Box
        h="fit-content"
        p={4}
        bg={isError ? "red.50" : "gray.800"}
        color={isError ? "red.400" : "gray.100"}
        border="1px solid"
        borderRadius="md"
        borderColor={isError ? "red.500" : "gray.700"}
      >
        {output && output.length > 0 ? (
          output.map((line, i) => <Text key={i}>{line}</Text>)
        ) : (
          <Text>Click "Run Code" to see the output here</Text>
        )}
      </Box>
      <Input
        placeholder="Enter input here..."
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        mt={4}
        mb={4}
        bg="gray.700"
        color="gray.100"
        borderColor="gray.600"
      />
      <HStack spacing={4}>
        <Button
          variant="solid"
          colorScheme="teal"
          isLoading={isLoading}
          onClick={runCode}
        >
          Run Code
        </Button>
        <Button
          variant="outline"
          colorScheme="teal"
          isLoading={isLoading}
          onClick={submitCode}
        >
          Submit
        </Button>
      </HStack>

      {/* Timer Display */}

      {/* Drawer Component */}
      <Drawer
        placement="right"
        onClose={toggleDrawer}
        isOpen={isDrawerOpen}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent bg="gray.900" color="gray.100">
          <DrawerCloseButton />
          <DrawerHeader bg="teal.500" color="white">
            Test Cases Result
          </DrawerHeader>
          <DrawerBody>
            {isLoading ? (
              <Flex justify="center" align="center" h="100%">
                <Spinner size="xl" color="teal.500" />
              </Flex>
            ) : testResults.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {testResults.map((test, index) => (
                  <Box
                    key={index}
                    p={4}
                    borderRadius="md"
                    bg={test.passed ? "green.100" : "red.100"}
                    display="flex"
                    alignItems="center"
                  >
                    <Icon
                      as={test.passed ? CheckCircleIcon : WarningIcon}
                      color={test.passed ? "green.500" : "red.500"}
                      mr={4}
                      boxSize={6}
                    />
                    <Box>
                      <Text fontWeight="bold" color="gray.800">
                        {test.passed ? "Passed" : "Failed"}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Expected: {test.expected}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Got: {test.output}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text>No test results available.</Text>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Output;
