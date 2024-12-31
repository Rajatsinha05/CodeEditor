import React, { useRef, useState, useEffect, useMemo } from "react";
import { Box, useToast, useColorModeValue, Flex } from "@chakra-ui/react";
import * as monaco from "monaco-editor";
import { BsThreeDotsVertical } from "react-icons/bs";

import { useDispatch, useSelector } from "react-redux";
import { CODE_SNIPPETS } from "./constants";

import CameraDisplay from "./CameraDisplay";
import { getQuestionById } from "../../redux/Question/questionApi";
import { showToast } from "../../utils/toastUtils";
import ProblemDetails from "./ProblemDetails";
import CodeWorkspace from "./CodeWorkspace";

const CodeEditor = ({ problemId }) => {
  const editorRef = useRef();
  const [value, setValue] = useState(CODE_SNIPPETS["java"]);
  const [language, setLanguage] = useState("java");
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [dividerX, setDividerX] = useState(40); // Percentage for initial ProblemDetails width

  const { user } = useSelector((store) => store.user);
  const [testResults, setTestResults] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const dispatch = useDispatch();
  const { data } = useSelector((store) => store.test) || {};
  const { question } = useSelector((store) => store.question);

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

  const onMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();

    if (
      user.role === "SUPERADMIN" ||
      user.role === "ADMIN" ||
      user.email == "test@gmail.com"
    )
      return;

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {
      showToast(toast, "Copy Disabled", "warning");
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
      showToast(toast, "Paste Disabled", "warning");
    });
  };

  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startDividerX = dividerX;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const newDividerX = Math.max(
        10,
        Math.min(90, startDividerX + (deltaX / window.innerWidth) * 100)
      );
      setDividerX(newDividerX);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <Box
      p={6}
      bgGradient={useColorModeValue(
        "linear(to-r, gray.100, gray.200)",
        "linear(to-r, gray.700, gray.800)"
      )}
      color={textColor}
      height="100vh"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <CameraDisplay />

      <Flex
        height="calc(100% - 50px)"
        overflow="hidden"
        direction={{ base: "column", md: "row" }}
        gap={{ base: 4, md: 0 }}
      >
        {/* Problem Details */}
        <Box
          flex={{ base: "1", md: `0 0 ${dividerX}%` }}
          height={{ base: "auto", md: "100%" }}
          overflowY="auto"
          borderRight={{ base: "none", md: `1px solid ${textColor}` }}
          shadow="md"
          borderRadius="lg"
          p={4}
          bg={useColorModeValue("white", "gray.900")}
        >
          <ProblemDetails question={question} />
        </Box>

        {/* Resizer */}
        <Box
          width="10px"
          cursor="ew-resize"
          bg={useColorModeValue("gray.200", "gray.700")}
          display={{ base: "none", md: "flex" }} // Hide on mobile
          onMouseDown={handleMouseDown}
          alignItems="center"
          justifyContent="center"
          _hover={{ bg: useColorModeValue("gray.300", "gray.600") }}
        >
          <BsThreeDotsVertical
            size={20}
            color={useColorModeValue("gray.500", "white")}
          />
        </Box>

        {/* Code Workspace */}
        <Box
          flex={{ base: "1", md: `0 0 ${100 - dividerX}%` }}
          height={{ base: "auto", md: "100%" }}
          overflowY="auto"
          borderRadius="lg"
          shadow="md"
          bg={useColorModeValue("white", "gray.900")}
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
            editorRef={editorRef}
            monaco={monaco}
            data={data}
            question={question}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default CodeEditor;
