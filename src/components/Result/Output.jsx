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

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  saveOrUpdateSolvedQuestion,
  updateObtainedMarks,
} from "../../redux/ContestQuestionSolvedSplice";

import { getContestById } from "../../redux/contestSlice";
import { showToast } from "../../utils/toastUtils";
import { saveQuestionSolved } from "../../redux/Question/questionSolvedSlice";
import {
  endContestAttempt,
  fetchContestAttemptsByStudentAndContest,
} from "../../redux/contestAttemptSlice";
import TestCasesDrawer from "./TestResultsDrawer";

const Output = ({
  editorRef,
  language,
  inputData = "",
  expectedOutput = "",
  type,
}) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const [isNeedAttemptedId, setIsNeedAttemptedId] = useState(false);
  // Selectors at the top level
  const { questionId, contestId,attemptId } = useParams();


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

  useEffect(() => {
    if (studentId && contestId && isNeedAttemptedId) {
      // Dispatch the thunk with the required parameters
      dispatch(
        fetchContestAttemptsByStudentAndContest({ studentId, contestId })
      );
    }
  }, [studentId, contestId, dispatch]);

  const handleEndContest = () => {
    if (!attemptId) {
      console.error("Attempt ID is missing.");
      showToast(
        toast,
        "Unable to end the contest. Attempt ID is missing.",
        "error"
      );
      return;
    }

    console.log("Attempting to end contest with attemptId:", attemptId);

    // Dispatching the action to end the contest attempt
    dispatch(endContestAttempt({ attemptId }))
      .unwrap()
      .then((data) => {
        console.log("Contest ended successfully:", data);
        showToast(toast, "Submitted Successfully", "success");
      })
      .catch((error) => {
        console.error("Error ending contest:", error);
        showToast(toast, error || "Failed to end the contest.", "error");
      });
  };

  // State management
  const [output, setOutput] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      if (input.length == 0) {
        showToast(toast, "Enter number of test case to run.", "warning");
        return;
      } else {
        const res = await executeCode(language, sourceCode, input.trim());

        const result = await getCodeResult(res.requestId);

        const resultOutput =
          result.output?.split("\n").filter((line) => line.trim() !== "") || [];

        setOutput(resultOutput);
        setIsError(!!result.stderr);

        if (result.stderr) {
          showToast(toast, result.stderr, "error", 6000);
        }
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
      // store data for records

      // Calculate the number of passed test cases
      const passedTests = results.filter((test) => test.passed).length;
      const percentagePassed = (passedTests / totalTests) * 100;

      let solvedQuestion = {
        questionId,
        studentId,
        executionTime: result.executionTime,
        memoryUsage: result.memoryUsed,
        language,
        code: sourceCode,
        testCase: percentagePassed === 100 ? "PASSED" : "FAILED",
      };
      if (!contestId) {
        dispatch(saveQuestionSolved(solvedQuestion));
      }

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
            } else {
              // Update obtained marks if the current obtained marks are higher
              await dispatch(
                updateObtainedMarks({
                  id: existingSolvedQuestion.id,
                  questionId,
                  contestId,
                  studentId,
                  obtainedMarks,
                  contestQuestionId: marks?.contestQuestionId,
                })
              ).unwrap();
              showToast(
                toast,
                `You have obtained ${obtainedMarks} out of ${totalMarks} marks.`,
                "success"
              );
            } // Ensure that errors are caught
          } else {
            // Save or create new solved question if no previous record exists
            await dispatch(
              saveOrUpdateSolvedQuestion({
                questionId,
                contestId,
                studentId,
                obtainedMarks,
                contestQuestionId: marks?.contestQuestionId,
              })
            ).unwrap();
            showToast(
              toast,
              `You have obtained ${obtainedMarks} out of ${totalMarks} marks.`,
              "success",
              6000
            );
          }
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
      <HStack spacing={4} mt={6} w="100%">
        <Flex
          justifyContent={{ base: "center", md: "space-between" }}
          align="center"
          w="100%"
          flexDirection={{ base: "column", md: "row" }}
        >
          {/* Left-aligned buttons */}
          <HStack
            spacing={4}
            mb={{ base: 4, md: 0 }}
            justifyContent={{ base: "center", md: "flex-start" }}
          >
            <Button
              variant="solid"
              colorScheme="teal"
              size="lg"
              isLoading={isLoading}
              onClick={runCode}
              _hover={{ bg: "teal.500", shadow: "lg" }}
              shadow="md"
              transition="all 0.3s"
            >
              Run Code
            </Button>
            <Button
              variant="outline"
              colorScheme="teal"
              size="lg"
              isLoading={isLoading}
              onClick={submitCode}
              border="2px"
              borderColor="teal.400"
              _hover={{ bg: "teal.600", color: "white", shadow: "lg" }}
              shadow="md"
              transition="all 0.3s"
            >
              Submit
            </Button>
          </HStack>

          {/* Right-aligned button */}
          {contestId && (
            <Button
              variant="outline"
              colorScheme="teal"
              size="lg"
              isLoading={isLoading}
              px={8}
              onClick={handleEndContest}
              border="2px"
              borderColor="teal.400"
              _hover={{ bg: "teal.600", color: "white", shadow: "lg" }}
              shadow="md"
              transition="all 0.3s"
            >
              Submit Contest
            </Button>
          )}
        </Flex>
      </HStack>

      <TestCasesDrawer
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        isLoading={false}
        testResults={testResults}
      />
    </Box>
  );
};

export default React.memo(Output);
