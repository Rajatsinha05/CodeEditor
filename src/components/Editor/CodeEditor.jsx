import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  useToast,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
  Tag,
} from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { useDispatch, useSelector } from "react-redux";

import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "./constants";
import Output from "../Result/Output";
import TestResultsDrawer from "../Result/TestResultsDrawer";
import CustomSelect from "./CustomSelect";
import CameraDisplay from "./CameraDisplay";
import CodeSuggestions from "./CodeSuggestions";
import TimerDisplay from "../Result/TimerDisplay";
import { getQuestionById } from "../../redux/Question/questionApi";

const CodeEditor = ({ problemId }) => {
  const editorRef = useRef();
  const [value, setValue] = useState(CODE_SNIPPETS["java"]); // Default to Java
  const [language, setLanguage] = useState("java"); // Default language set to Java
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [inactiveTime, setInactiveTime] = useState(0);
  const [tabChangeCount, setTabChangeCount] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [isScreenBlurred, setIsScreenBlurred] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const { data } = useSelector((store) => store.test)||{}

  const { question } = useSelector((store) => store.question);

  // Color mode dependent values
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const textColor = useColorModeValue("blackAlpha.800", "whiteAlpha.900");
  const tagColorScheme = useColorModeValue("purple", "cyan");
  const boxBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  const videoBoxSize = useBreakpointValue({ base: "50px", md: "80px" });

  useEffect(() => {
    setTheme(colorMode === "dark" ? "vs-dark" : "vs-light");
  }, [colorMode]);

  // Fetch question data if not already present
  const shouldFetchQuestion = useMemo(
    () => !question || question.id !== problemId,
    [question, problemId]
  );

  useEffect(() => {
    if (shouldFetchQuestion) {
      dispatch(getQuestionById(problemId));
    }
  }, [dispatch, problemId, shouldFetchQuestion]);


  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabChangeCount((prevCount) => prevCount + 0.5);
        const id = setInterval(() => {
          setInactiveTime((prev) => prev + 1);
        }, 1000);
        setIntervalId(id);
      } else {
        setTabChangeCount((prevCount) => prevCount + 0.5);
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [intervalId]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "PrintScreen" ||
        (event.ctrlKey && event.shiftKey && event.key === "S") ||
        (event.metaKey && event.shiftKey && event.key === "S") ||
        (event.metaKey &&
          event.shiftKey &&
          (event.key === "3" || event.key === "4"))
      ) {
        setIsScreenBlurred(true);
        toast({
          title: "Screenshot Attempt Detected",
          description: "Screenshots are not allowed.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });

        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toast]);

  const onMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {
      toast({
        title: "Copy Disabled",
        description: "Copying is disabled in the editor.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-center",
      });
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
      toast({
        title: "Paste Disabled",
        description: "Pasting is disabled in the editor.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setValue(CODE_SNIPPETS[newLanguage]);
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <Box p={4} position="relative" bg={bgColor} color={textColor}>
      <CameraDisplay videoBoxSize={videoBoxSize} />

      {isScreenBlurred && (
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          backgroundColor="rgba(255, 255, 255, 0.8)"
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex="10"
        >
          <Text fontSize="2xl" color="red.500">
            Screenshot Attempt Detected
          </Text>
        </Box>
      )}

      <HStack spacing={8} flexDirection="row">
        {/* Left side: Question details */}
        <VStack align="stretch" flex={1}>
          <Text fontSize="2xl" fontWeight="bold">
            {question?.title}
          </Text>

          <Text fontSize="lg" color="gray.600">
            {question?.description}
          </Text>

          <Tag
            size="lg"
            colorScheme={
              question?.difficultLevel === "EASY"
                ? "green"
                : question?.difficultLevel === "MEDIUM"
                ? "yellow"
                : "red"
            }
          >
            Difficulty: {question?.difficultLevel}
          </Tag>

          <VStack align="stretch" mt={4}>
            <Text fontWeight="bold">Input:</Text>
            <Box
              bg={boxBg}
              p={2}
              borderRadius="md"
              border={`1px solid ${borderColor}`}
              width="100%"
            >
              <Text>{question?.input}</Text>
            </Box>

            <Text fontWeight="bold">Expected Output:</Text>
            <Box
              bg={boxBg}
              p={2}
              borderRadius="md"
              border={`1px solid ${borderColor}`}
              width="100%"
            >
              <Text whiteSpace="pre-wrap">{question?.expectedOutput}</Text>
            </Box>
          </VStack>

          {question?.examples?.length > 0 && (
            <VStack align="stretch" mt={4}>
              <Text fontWeight="bold">Examples:</Text>
              {question.examples.map((example) => (
                <Box
                  key={example.id}
                  p={3}
                  borderWidth={1}
                  borderColor={borderColor}
                  borderRadius="md"
                  bg={boxBg}
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
            </VStack>
          )}
        </VStack>

        {/* Right side: Code Editor */}
        <Box flex={1} width="auto">
          <VStack spacing={4} align="stretch">
            <HStack flexWrap="wrap">
              <LanguageSelector
                language={language}
                onSelect={handleLanguageChange}
              />
              <CustomSelect
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                options={[
                  { value: "vs-dark", label: "Dark Theme" },
                  { value: "vs-light", label: "Light Theme" },
                ]}
                width="150px"
              />
              <CustomSelect
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                options={[
                  { value: 14, label: "14px" },
                  { value: 16, label: "16px" },
                  { value: 18, label: "18px" },
                ]}
                width="120px"
              />
              <TimerDisplay endTime={data?.contest?.endTime} />
            </HStack>

            <Box bg="gray.800" borderRadius="md" p={4} position="relative">
              <Editor
                options={{
                  minimap: { enabled: true },
                  fontSize: fontSize,
                  wordWrap: "on",
                }}
                height="50vh"
                width="100%"
                theme={theme}
                language={language}
                onMount={onMount}
                value={value}
                onChange={(v) => setValue(v)}
              />
              <CodeSuggestions monaco={monaco} language={language} />
            </Box>

            <Box>
              <Output
                editorRef={editorRef}
                language={language}
                inputData={question?.input}
                expectedOutput={question?.expectedOutput}
              />
              <TestResultsDrawer
                isLoading={isLoading}
                isDrawerOpen={isDrawerOpen}
                toggleDrawer={toggleDrawer}
                testResults={testResults}
              />
            </Box>
          </VStack>
        </Box>
      </HStack>

      <Text mt={4}>Inactive Time: {inactiveTime} seconds</Text>
      <Text mt={4}>Tab Changes: {tabChangeCount}</Text>
    </Box>
  );
};

export default CodeEditor;
