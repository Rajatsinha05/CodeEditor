import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  HStack,
  VStack,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import Draggable from "react-draggable";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";

const CodeEditor = () => {
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
  const toast = useToast(); // Toast hook for displaying messages

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
        theme: "dark",
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

  return (
    <Box p={4} position="relative">
      {!isCameraActive && (
        <Text color="red.500" mb={4}>
          Please Turn your Camera .
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
              style={{ width: "150px", borderRadius: "8px" }}
            />
          </Box>
        </Draggable>
      )}
      <HStack spacing={8}>
        <VStack align="stretch" justifyContent="flex-start" flex={1}>
          <Text textAlign="left">
            **DSA Question:** Find the missing number in an array containing
            integers from 1 to n. One number is missing from the array. Write a
            function to find the missing number. Example: Input: [1, 2, 4, 6, 3,
            7, 8] Output: 5
          </Text>
        </VStack>
        <Box flex={1}>
          <VStack spacing={4} align="stretch">
            <HStack>
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
            <Box bg="gray.800" borderRadius="md" p={4}>
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
              <Output editorRef={editorRef} language={language} />
            </Box>
          </VStack>
        </Box>
      </HStack>
      <HStack spacing={4} mt={4}>
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
      <Text mt={4}>Tab Changes: {tabChangeCount}</Text>{" "}
      {/* Display tab change count */}
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
