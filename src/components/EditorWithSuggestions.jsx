import React from "react";
import { Box } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";

const EditorWithSuggestions = ({
  value,
  language,
  theme,
  fontSize,
  onMount,
  onSuggestions,
  setValue,
}) => {
  return (
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
        value={value}
        defaultValue={value}
        onMount={onMount}
        onChange={setValue}
      />
    </Box>
  );
};

export default React.memo(EditorWithSuggestions);
