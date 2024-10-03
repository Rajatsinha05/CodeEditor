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
import { executeCode } from "../api";
import Cookie from "js-cookie";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveOrUpdateSolvedQuestion } from "../redux/QuestionSolvedSplice";

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
  const { user } = useSelector((store) => store.data);
  const { contest } = useSelector((store) => store.contest);
  const studentId = user?.id;

  // State management
  const [output, setOutput] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [token, setToken] = useState("");

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
      toast({
        title: "Editor Not Ready",
        description: "Please wait until the editor is fully loaded.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const sourceCode = editorRef.current.getValue();
    if (!sourceCode.trim()) {
      toast({
        title: "No Code Provided",
        description: "Please enter some code to run.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    console.log(
      "let marks = contest?.contestQuestions",
      contest?.contestQuestions
    );

    setIsLoading(true);
    setIsError(false);
    setOutput(null);

    try {
      const result = await executeCode(language, sourceCode, input.trim());
      const resultOutput =
        result.output?.split("\n").filter((line) => line.trim() !== "") || [];

      setOutput(resultOutput);
      setIsError(!!result.stderr);

      if (result.stderr) {
        toast({
          title: "Runtime Error",
          description: result.stderr,
          status: "error",
          duration: 6000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Execution Failed",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [editorRef, language, input, toast]);

  const submitCode = useCallback(async () => {
    if (!editorRef?.current) {
      toast({
        title: "Editor Not Ready",
        description: "Please wait until the editor is fully loaded.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const sourceCode = editorRef.current.getValue();
    if (!sourceCode.trim()) {
      toast({
        title: "No Code Provided",
        description: "Please enter some code to submit.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!questionId || !studentId) {
      toast({
        title: "Submission Failed",
        description: "Invalid question or user information.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setTestResults([]);
    setOutput(null);

    try {
      const result = await executeCode(language, sourceCode, inputData.trim());
      const resultOutput =
        result.output?.split("\n").filter((line) => line.trim() !== "") || [];

      setOutput(resultOutput);

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
      console.log("percentagePassed: ", percentagePassed);

      // Get marks from contest question and calculate obtained marks
      let marks = contest?.contestQuestions.filter(
        (que) => que.questionId == questionId
      );
      console.log("marks: ", marks, questionId);

      const totalMarks = marks[0]?.marks || 0;
      console.log("totalMarks: ", totalMarks);
      const obtainedMarks = Math.round((percentagePassed / 100) * totalMarks);
      console.log("obtainedMarks: ", obtainedMarks);

      // Save the results to the backend (create or update)
      await dispatch(
        saveOrUpdateSolvedQuestion({
          questionId,
          contestId,
          studentId,
          obtainedMarks,
          contestQuestionId: marks?.id || 1,
        })
      );

      // Check if all tests passed
      const allPassed = passedTests === totalTests;
      if (allPassed) {
        toast({
          title: "All Tests Passed!",
          description: `You have obtained ${obtainedMarks} out of ${totalMarks} marks.`,
          status: "success",
          duration: 6000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Some Tests Failed",
          description: `You passed ${passedTests} out of ${totalTests} test cases. You have obtained ${obtainedMarks} out of ${totalMarks} marks.`,
          status: "warning",
          duration: 6000,
          isClosable: true,
        });
      }

      setIsError(!!result.stderr);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error.message || "Unable to submit code",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
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
