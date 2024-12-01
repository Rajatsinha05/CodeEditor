import React from "react";
import {
  Box,
  VStack,
  HStack,
  Stack,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import CodeSuggestions from "./CodeSuggestions";
import LanguageSelector from "./LanguageSelector";
import CustomSelect from "./CustomSelect";
import TimerDisplay from "../Result/TimerDisplay";
import Output from "../Result/Output";
import TestResultsDrawer from "../Result/TestResultsDrawer";

const CodeWorkspace = ({
  language,
  theme,
  fontSize,
  value,
  setLanguage,
  setTheme,
  setFontSize,
  setValue,
  onMount,
  testResults,
  isLoading,
  isDrawerOpen,
  toggleDrawer,
  editorRef,
  monaco,
  data,
  question,
}) => {
  const boxBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  // Responsive styles
  const controlFlexDirection = useBreakpointValue({
    base: "column", // Stack controls vertically on smaller screens
    md: "row", // Stack controls horizontally on medium and larger screens
  });

  const editorHeight = useBreakpointValue({
    base: "40vh", // Smaller editor height for smaller screens
    md: "50vh", // Default height for medium and larger screens
  });

  return (
    <Box flex={1}>
      <VStack spacing={6} align="stretch">
        {/* Language and Settings Controls */}
        <Stack
          direction={controlFlexDirection}
          spacing={4}
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <LanguageSelector language={language} onSelect={setLanguage} />

          <CustomSelect
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            options={[
              { value: "vs-dark", label: "Dark Theme" },
              { value: "vs-light", label: "Light Theme" },
            ]}
            width={{ base: "100%", md: "150px" }}
          />

          <CustomSelect
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            options={[
              { value: 14, label: "14px" },
              { value: 16, label: "16px" },
              { value: 18, label: "18px" },
            ]}
            width={{ base: "100%", md: "120px" }}
          />

          <TimerDisplay endTime={data?.contest?.endTime} />
        </Stack>

        {/* Code Editor Section */}
        <Box
          // bg={boxBg}
          borderRadius="md"
          p={4}
          border={`1px solid ${borderColor}`}
          position="relative"
          width="100%"
        >
          <Editor
            options={{
              minimap: { enabled: true },
              fontSize: fontSize,
              wordWrap: "on",
            }}
            height={editorHeight}
            width="100%"
            theme={theme}
            language={language}
            onMount={onMount}
            value={value}
            onChange={(v) => setValue(v)}
          />
          <CodeSuggestions monaco={monaco} language={language} />
        </Box>

        {/* Output and Test Results */}
        <Box>
          <Output
            editorRef={editorRef}
            language={language}
            inputData={question?.input}
            expectedOutput={question?.expectedOutput}
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
  );
};

export default CodeWorkspace