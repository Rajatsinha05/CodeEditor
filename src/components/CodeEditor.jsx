import React, { useRef, useState } from "react";
import { Box, HStack, Button, Spacer } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState(CODE_SNIPPETS["javascript"]);
  const [language, setLanguage] = useState("javascript");

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
        return {
          suggestions: [
            {
              label: "console.log",
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: "console.log('${1:}')",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Log to console",
            },
            // Add more suggestions as needed
          ],
        };
      },
    });
  };

  const handleRunClick = () => {
   
  };

  const handleSubmitClick = () => {
    
  };

  return (
    <Box p={4}>
      <Box >
        text
      </Box>
      <HStack spacing={4}>
        <Box w="50%">
          <LanguageSelector language={language} onSelect={onSelect} />
          <Box bg="gray.800" borderRadius="md" p={4}>
            <Editor
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                suggest: {
                
                  showWords: true,
                  showMethods: true,
                  showFunctions: true,
                },
              }}
              height="75vh"
              theme="vs-dark" 
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
        </Box>
        <Output editorRef={editorRef} language={language} />
      </HStack>

    </Box>
  );
};

export default CodeEditor;
