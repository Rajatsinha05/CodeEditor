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

const CodeEditor = ({ problemId }) => {
  const questions = [
    {
      topic: "Variables",
      title: "Print Number",
      difficulty: "Low",
      description: "Create a variable called `num` of integer type.",
      input: "input is required.",
      output: "Print the value stored in the variable `num`.",
      testCases: [
        { input: 5, expectedOutput: 5 },
        { input: 10, expectedOutput: 10 },
        { input: 20, expectedOutput: 20 },
        { input: -20, expectedOutput: -20 },
        { input: 100, expectedOutput: 100 },
      ],
      inputData:"5 5 10 20 -20 100",
      expectedOutput:[5,10,20,-20,100]
    },
    {
      topic: "Variables",
      title: "Print string variable",
      difficulty: "Low",
      description: "Create a variable called `str` of string type.",
      input: "Take input",
      output: "Print the value stored in the variable `str`.",
      testCases: [
        { input: "helloword", expectedOutput: "helloword" },
        { input: "helloword", expectedOutput: "helloword" },
        { input: "Education", expectedOutput: "Education" },
        { input: "Education", expectedOutput: "Education" },
        { input: "redandwhite", expectedOutput: "redandwhite" },
        { input: "redandwhite", expectedOutput: "redandwhite" },
      ],
    },
    {
      topic: "Variables",
      title: "Printing Two Variables on Separate Lines",
      difficulty: "Low",
      description: "Create two variables called `str1` and `str2`.",
      input: "Take input",
      output:
        "Print the values stored in the variables `str1` and `str2`, each on a separate line.",
      testCases: [
        { input: "Test Case", expectedOutput: "Test Case" },
        { input: "Test Case", expectedOutput: "Test Case" },
        { input: "C++ Programming", expectedOutput: "C++ Programming" },
        { input: "C++ Programming", expectedOutput: "C++ Programming" },
        { input: "One Two", expectedOutput: "One Two" },
        { input: "One Two", expectedOutput: "One Two" },
        { input: "Hello world!", expectedOutput: "Hello world!" },
        { input: "Hello world!", expectedOutput: "Hello world!" },
        { input: "c c++", expectedOutput: "c c++" },
        { input: "c c++", expectedOutput: "c c++" },
      ],
    },
    {
      topic: "Operator",
      title: "Calculate",
      difficulty: "Low",
      description:
        "You are required to perform a series of operations on a number and then print the updated value.",
      input: "Take input stored in the variable `number`.",
      output:
        "Print the updated value of the variable `number` after performing the operations.",
      testCases: [
        { input: 4, expectedOutput: 9 },
        { input: 10, expectedOutput: 27 },
        { input: 20, expectedOutput: 147 },
        { input: 100, expectedOutput: 147 },
        { input: 150, expectedOutput: 447 },
      ],

      inputData:"5 4 10 20 100 150"
    },
    {
      topic: "Operator",
      title: "Multiply by 50",
      difficulty: "Low",
      description:
        "Create a variable named `number`, you are required to multiply it by 50 and print the result obtained.",
      input: "Take input value store in the variable `number`.",
      output:
        "Print the result obtained after multiplying the value stored in the variable `number` by 50.",
      testCases: [
        { input: 4, expectedOutput: 200 },
        { input: 3, expectedOutput: 150 },
        { input: 1, expectedOutput: 50 },
        { input: 0, expectedOutput: 0 },
        { input: -2, expectedOutput: -100 },
      ],
    },
    {
      topic: "Operator",
      title: "Square and Sum",
      difficulty: "Low",
      description:
        "You have to take three numbers stored in variables with the names `one`, `two`, and `three`. Your task is to find the square of each of these numbers and calculate the sum of their square values.",
      input: "Take input",
      output: "Print the sum of the square values of the three numbers.",
      testCases: [
        { input: "1 2 3", expectedOutput: 14 },
        { input: "0 5 10", expectedOutput: 125 },
        { input: "-3 -2 -1", expectedOutput: 14 },
        { input: "4 7 9", expectedOutput: 146 },
        { input: "6 8 12", expectedOutput: 244 },
      ],
    },
    {
      topic: "Condition",
      title: "Arithmetic Operations on Two Numbers",
      difficulty: "Low",
      description:
        "You are required to take three inputs: `num1`, `num2`, and `query`. Based on the value of `query`, perform arithmetic operations.",
      input: "Three integers separated by space: `num1`, `num2`, and `query`.",
      output: "Print the result of the corresponding operation.",
      testCases: [
        { input: "10 5 1", expectedOutput: "15" },
        { input: "10 5 2", expectedOutput: "5" },
        { input: "10 5 3", expectedOutput: "2" },
        { input: "10 5 4", expectedOutput: "50" },
        { input: "10 5 5", expectedOutput: "0" },
        { input: "10 3 3", expectedOutput: "3" },
      ],
    },
    {
      topic: "Condition",
      title: "Find your friend",
      difficulty: "Low",
      description:
        "You have built your own social networking website with unique rules for making friends based on age.",
      input: "Take input age of a person stored in the variable `N`.",
      output:
        "Print the distance within which people can make friends based on the rules mentioned above.",
      testCases: [
        { input: 15, expectedOutput: "5 Kms" },
        { input: 10, expectedOutput: "1 Kms" },
        { input: 25, expectedOutput: "10 Kms" },
        { input: 35, expectedOutput: "You can have friends from anywhere" },
        { input: 8, expectedOutput: "1 Kms" },
      ],
    },
  ];
  const editorRef = useRef();
  const [value, setValue] = useState(CODE_SNIPPETS["javascript"]);
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const videoRef = useRef();
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [inactiveTime, setInactiveTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [tabChangeCount, setTabChangeCount] = useState(0);
  const [isScreenBlurred, setIsScreenBlurred] = useState(false);
  const toast = useToast();
  const [contests, setContests] = useState([]);
  const [inputData, setInputData] = useState('');
  const [expectedOutput, setExpectedOutput] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addContest = (contest) => {
    setContests((prevContests) => [...prevContests, contest]);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };


  useEffect(() => {
    const openCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = handleDataAvailable;
        setMediaRecorder(recorder);

        // Load the face detection model

        setIsCameraActive(true);
      } catch (err) {
        console.error("Error accessing the camera: ", err);
        setIsCameraActive(false);
        toast({
          title: "Error",
          description: "Failed to access the camera.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    openCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [toast]);

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

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks((prev) => [...prev, event.data]);
    }
  };

  const startRecording = () => {
    setRecordedChunks([]);
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopCameraAccess = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    toast({
      title: "Camera Stopped",
      description: "Camera access has been stopped.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

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
      {!isCameraActive && (
        <Text color="red.500" mb={4}>
          Please Turn your Camera.
        </Text>
      )}
      {!isRecording && isCameraActive && (
        <Draggable>
          <Box
            position="absolute"
            top="20px"
            right="20px"
            bg="gray.800"
            borderRadius="md"
            p={1}
          >
            <video
              ref={videoRef}
              autoPlay
              style={{ width: videoBoxSize, borderRadius: "8px" }}
            />
          </Box>
        </Draggable>
      )}

      <HStack spacing={8} flexDirection={isMobile ? "column" : "row"}>
      <VStack align="stretch" justifyContent="flex-start" flex={1}>
          <Text fontSize="2xl" fontWeight="bold">
            {questions[problemId - 1].title}
          </Text>
          <Text fontSize="lg" color="gray.600">
            {questions[problemId - 1].description}
            
          </Text>
          <Text fontSize="lg" color="gray.600">
            {questions[problemId - 1].input}
            
          </Text>
          <Text fontSize="lg" color="gray.600">
            {questions[problemId - 1].output}
            
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
                  minimap: { enabled: false },
                  fontSize: fontSize,
                  wordWrap: "on",
                  suggest: {
                    showWords: true,
                    showMethods: true,
                    showFunctions: true,
                  },
                }}
                height="50vh"
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
          inputData={inputData}
          expectedOutput={expectedOutput}
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
      <HStack spacing={4} mt={4} flexWrap="wrap">
        <Button
          onClick={startRecording}
          isDisabled={isRecording || !isCameraActive}
          colorScheme="green"
        >
          Start Recording
        </Button>
        <Button onClick={stopCameraAccess} colorScheme="red">
          Stop Camera Access
        </Button>
      </HStack>
      <Text mt={4}>Inactive Time: {inactiveTime} seconds</Text>
      <Text mt={4}>Tab Changes: {tabChangeCount}</Text>
    </Box>
  );
};

const CustomSelect = ({ value, onChange, options, ...rest }) => {
  return (
    <Select value={value} onChange={onChange} {...rest}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
};

export default CodeEditor;
