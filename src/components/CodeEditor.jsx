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
import * as faceapi from "face-api.js";


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
  const [isScreenBlurred, setIsScreenBlurred] = useState(false);
  const toast = useToast();
  const [isFaceDetected, setIsFaceDetected] = useState(true);

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
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

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

  useEffect(() => {
    const detectFace = async () => {
      try {
        const video = videoRef.current;
        if (video) {
          const detections = await faceapi.detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions()
          );
          setIsFaceDetected(detections.length > 0);
          if (!detections.length) {
            toast({
              title: "No Face Detected",
              description: "Please make sure your face is visible in the video.",
              status: "warning",
              duration: 3000,
              isClosable: true,
            });
          }
        }
      } catch (error) {
        console.error("Error detecting face:", error);
        setIsFaceDetected(false); // Set face detection status to false on error
        toast({
          title: "Error",
          description: "Failed to detect face.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
  
    const id = setInterval(detectFace, 1000);
    return () => clearInterval(id);
  }, [toast]);
  

  const videoBoxSize = useBreakpointValue({ base: "80px", md: "150px" });
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box p={4} position="relative">
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
          <Text textAlign="left">
            **DSA Question:** Find the missing number in an array containing
            integers from 1 to n. One number is missing from the array. Write a
            function to find the missing number. Example: Input: [1, 2, 4, 6, 3,
            7, 8] Output: 5
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
              <Output editorRef={editorRef} language={language} />
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
