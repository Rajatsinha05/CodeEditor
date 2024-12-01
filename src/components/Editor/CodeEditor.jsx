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
  Flex,
} from "@chakra-ui/react";
// import { Editor } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { useDispatch, useSelector } from "react-redux";
import { CODE_SNIPPETS } from "./constants";

import CameraDisplay from "./CameraDisplay";

import { getQuestionById } from "../../redux/Question/questionApi";
import { showToast } from "../../utils/toastUtils";
import ProblemDetails from "./ProblemDetails";
import CodeWorkspace from "./CodeWorkspace";

const CodeEditor = ({ problemId }) => {
  const editorRef = useRef();
  const [value, setValue] = useState(CODE_SNIPPETS["java"]); // Default to Java
  const [language, setLanguage] = useState("java"); // Default language set to Java
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [inactiveTime, setInactiveTime] = useState(0);
  const [tabChangeCount, setTabChangeCount] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const [testResults, setTestResults] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const editorContainerRef = useRef();

  const toast = useToast();
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const { data } = useSelector((store) => store.test) || {};

  const { question } = useSelector((store) => store.question);

  // Color mode dependent values
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const textColor = useColorModeValue("blackAlpha.800", "whiteAlpha.900");

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

  const onMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {
      showToast(toast, "Copy Disabled", "warning");
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
      showToast(toast, "Paste Disabled", "warning");
    });
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setValue(CODE_SNIPPETS[newLanguage]);
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <Box p={4} bg={bgColor} color={textColor} height="100vh">
      <CameraDisplay />

      <Flex
        direction={{ base: "column", lg: "row" }}
        gap={6}
        height="100%"
        overflow="hidden"
      >
        {/* Problem Details (40%) */}
        <Box
          flex={{ base: "1", lg: "0 0 40%" }}
          maxW={{ lg: "40%" }}
          minW="300px"
          height={{ base: "auto", lg: "100%" }}
          overflowY="auto"
          // bg={bgColor}
        >
          <ProblemDetails question={question} />
        </Box>

        {/* Code Workspace (60%) */}
        <Box
          flex={{ base: "1", lg: "0 0 60%" }}
          maxW={{ lg: "60%" }}
          height={{ base: "auto", lg: "100%" }}
          overflowY="auto"
          // bg={bgColor}
        >
          <CodeWorkspace
            language={language}
            theme={theme}
            fontSize={fontSize}
            value={value}
            setLanguage={setLanguage}
            setTheme={setTheme}
            setFontSize={setFontSize}
            setValue={setValue}
            onMount={onMount}
            testResults={testResults}
            isLoading={isLoading}
            isDrawerOpen={isDrawerOpen}
            toggleDrawer={toggleDrawer}
            editorRef={editorRef}
            monaco={monaco}
            data={data}
            question={question}
          />
        </Box>
      </Flex>

      <Text mt={4}>Inactive Time: {inactiveTime} seconds</Text>
      <Text>Tab Changes: {tabChangeCount}</Text>
    </Box>
  );
};

export default CodeEditor;