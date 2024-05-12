import React, { useRef, useState } from "react";
import { Box, HStack, VStack, Select, Text } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState(CODE_SNIPPETS["javascript"]);
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
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
    <Box p={4}>
      <HStack spacing={8}>
        <VStack align="stretch" justifyContent="flex-start" flex={1}>
          <Text textAlign="left">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            fermentum orci nec eros fringilla, vel tincidunt libero vehicula.
            Nulla facilisi. Cras ullamcorper risus vel mauris malesuada, quis
            dignissim sapien mollis. Aliquam erat volutpat. Suspendisse vel
            libero eu nibh faucibus euismod.
          </Text>
        </VStack>
        <Box flex={1}>
          {/* Code editor and output */}
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
                  onMount(editor);
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
