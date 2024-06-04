import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  HStack,
  VStack,
  Select,
  Text,
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import Draggable from "react-draggable";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import ContestCreation from "./ContestCreation";
import TestResultsDrawer from "./TestResultsDrawer";
import { useDispatch, useSelector } from "react-redux";
import { getQuestionById } from "../redux/apiSlice";
import CustomSelect from "./CustomSelect";
import CameraDisplay from "./CameraDisplay";

const CodeEditor = ({ problemId }) => {
  const editorRef = useRef();
  const [value, setValue] = useState(CODE_SNIPPETS["javascript"]);
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);

  const [inactiveTime, setInactiveTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [tabChangeCount, setTabChangeCount] = useState(0);
  const [isScreenBlurred, setIsScreenBlurred] = useState(false);
  const toast = useToast();
  const [contests, setContests] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addContest = (contest) => {
    setContests((prevContests) => [...prevContests, contest]);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  let dispatch = useDispatch();
  useEffect(() => {
    dispatch(getQuestionById(problemId));
  }, []);
  let { data } = useSelector((store) => store);

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

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const onSuggestions = (monaco, language) => {
    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: () => {
        let suggestions = [];
        switch (language) {
          case "javascript":
            suggestions = [
              {
                label: "console.log",
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: "console.log('${1:}')",
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: "Log to console",
              },
            ];
            break;
          case "python":
            suggestions = [
              {
                label: "print",
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: "print('${1:}')",
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: "Print to console",
              },
            ];
            break;
          default:
            suggestions = [];
        }
        return { suggestions };
      },
    });
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleFontSizeChange = (e) => {
    setFontSize(parseInt(e.target.value));
  };

  const videoBoxSize = useBreakpointValue({ base: "80px", md: "150px" });
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box p={4} position="relative">
      <ContestCreation addContest={addContest} />
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

      <HStack spacing={8} flexDirection={isMobile ? "column" : "row"}>
        <VStack align="stretch" justifyContent="flex-start" flex={1}>
          <Text fontSize="2xl" fontWeight="bold">
            {data.question.title}
          </Text>
          <Text fontSize="lg" color="gray.600">
            {data.question.description}
          </Text>
          <Text fontSize="lg" color="gray.600">
            {data.question.input}
          </Text>
          <Text fontSize="lg" color="gray.600">
            {data.question.output}
          </Text>
        </VStack>
        <Box flex={1} width={isMobile ? "100%" : "auto"}>
          <VStack spacing={4} align="stretch">
            <HStack flexWrap="wrap">
              <LanguageSelector language={language} onSelect={onSelect} />
              <CustomSelect
                value={theme}
                onChange={handleThemeChange}
                options={[
                  { value: "vs-dark", label: "Dark Theme" },
                  { value: "vs-light", label: "Light Theme" },
                ]}
                width="150px"
                mr={4}
              />
              <CustomSelect
                value={fontSize}
                onChange={handleFontSizeChange}
                options={[
                  { value: 14, label: "14px" },
                  { value: 16, label: "16px" },
                  { value: 18, label: "18px" },
                ]}
                width="120px"
              />
            </HStack>
            <Box bg="gray.800" borderRadius="md" p={4} position="relative">
            <Editor
                options={{
                  minimap: { enabled: true },
                  fontSize: fontSize,
                  wordWrap: "on",
                  suggest: {
                    showWords: true,
                    showMethods: true,
                    showFunctions: true,
                  },
                }}
                height="50vh"
                width="100%"
                theme={theme}
                language={language}
                defaultValue={CODE_SNIPPETS[language]}
                onMount={(editor, monaco) => {
                  onMount(editor, monaco);
                  onSuggestions(monaco, language);
                }}
                value={value}
                onChange={(value) => setValue(value)}
              />
            </Box>
            <Box>
              <Output
                editorRef={editorRef}
                language={language}
                inputData={data.question.input}
                expectedOutput={data.question.expectedOutput}
                contests={contests}
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
