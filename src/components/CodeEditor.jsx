import React, { useRef, useState, useEffect } from "react";
import { Box, Button, HStack, VStack, Select, Text } from "@chakra-ui/react";
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

  useEffect(() => {
    const openCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = handleDataAvailable;
        setMediaRecorder(recorder);
      } catch (err) {
        console.error("Error accessing the camera: ", err);
      }
    };

    openCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

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
      tracks.forEach(track => track.stop());
    }
  };

  const onMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();

    // Disable copy (Ctrl+C) and paste (Ctrl+V)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {
      console.log("Copy operation is disabled.");
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
      console.log("Paste operation is disabled.");
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
                  monaco.languages.CompletionItemInsertTextRule
                    .InsertAsSnippet,
                documentation: "Log to console",
              },
              // Add more JavaScript suggestions here
            ];
            break;
          case "python":
            suggestions = [
              {
                label: "print",
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: "print('${1:}')",
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule
                    .InsertAsSnippet,
                documentation: "Print to console",
              },
              // Add more Python suggestions here
            ];
            break;
          // Add more cases for other languages here
          default:
            suggestions = [];
        }
        return {
          suggestions,
        };
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
      {!isRecording && (
        <Draggable>
          <Box position="absolute" top="20px" right="20px" bg="gray.800" borderRadius="md" p={1}>
            <video ref={videoRef} autoPlay style={{ width: "150px", borderRadius: "8px" }} />
          </Box>
        </Draggable>
      )}
      <HStack spacing={8}>
        <VStack align="stretch" justifyContent="flex-start" flex={1}>
          <Text textAlign="left">
            **DSA Question:** Find the missing number in an array containing integers from 1 to n. One number is missing from the array. Write a function to find the missing number.
            Example:
            Input: [1, 2, 4, 6, 3, 7, 8]
            Output: 5
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
        <Button onClick={startRecording} isDisabled={isRecording} colorScheme="green">Start Recording</Button>
        <Button onClick={stopCameraAccess} colorScheme="red">Stop Camera Access</Button>
      </HStack>
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
