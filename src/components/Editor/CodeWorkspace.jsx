import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  Box,
  VStack,
  Stack,
  HStack,
  useColorModeValue,
  IconButton,
  Text,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";
import { FaClock, FaSync, FaHistory } from "react-icons/fa";
const MonacoEditor = React.lazy(() => import("@monaco-editor/react"));
import TimerDisplay from "../Result/TimerDisplay";
import Output from "../Result/Output";
import TestResultsDrawer from "../Result/TestResultsDrawer";
import { CODE_SNIPPETS } from "./constants";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchByStudentIdAndQuestionId } from "../../redux/Question/questionSolvedSlice";
import SettingsModal from "./SettingsModal";
import {
  fetchSolvedQuestionsByContestStudentAndQuestion,
  fetchSolvedQuestionsByStudentIdAndContestId,
} from "../../redux/ContestQuestionSolvedSplice";
import useTabActivityTracker from "./useTabActivityTracker";

const CodeWorkspace = ({
  theme,
  fontSize,
  value,
  setTheme,
  setFontSize,
  setValue,
  onMount,
  testResults,
  isLoading,
  isDrawerOpen,
  toggleDrawer,
  editorRef,
  data,
  question,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [layout, setLayout] = useState("single");
  const [preferences, setPreferences] = useState({
    showSnippets: true,
    showLineNumbers: true,
    language: "java",
  });

  // const inactiveTimeRef = useRef(0);
  // const tabChangeCountRef = useRef(0);
  const intervalIdRef = useRef(null);

  const boxBg = useColorModeValue("gray.50", "gray.700");
  const outputBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  const { combinedRecord } = useSelector((store) => store.questionSolved);
  const { questionId, contestId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);

  const studentId = useMemo(() => user?.id, [user]);

  // Fetch question-solved data
  useEffect(() => {
    if (studentId && questionId) {
      if (contestId) {
        dispatch(
          fetchSolvedQuestionsByContestStudentAndQuestion({
            contestId,
            studentId,
            questionId,
          })
        );
      } else {
        dispatch(fetchByStudentIdAndQuestionId({ studentId, questionId }));
      }
    }
  }, [dispatch, studentId, questionId, contestId]);

  // Initialize language preferences
  useEffect(() => {
    const storedLanguage = localStorage.getItem("defaultLanguage") || "java";
    setPreferences((prev) => ({ ...prev, language: storedLanguage }));
    setValue(CODE_SNIPPETS[storedLanguage] || "");
  }, [setValue]);

  // solved in contest

  const { solvedQuestions } = useSelector((store) => store.solved);

  // Handle language change
  const handleLanguageChange = useCallback(
    (newLanguage) => {
      setPreferences((prev) => ({ ...prev, language: newLanguage }));
      setValue(CODE_SNIPPETS[newLanguage] || "");
      localStorage.setItem("defaultLanguage", newLanguage);
    },
    [setValue]
  );

  // Handle version selection
  const handleVersionSelect = useCallback(
    (record) => {
      setPreferences((prev) => ({ ...prev, language: record.language }));
      setValue(record.code);
    },
    [setPreferences, setValue]
  );

  const { inactiveTime, tabChangeCount } = useTabActivityTracker();
  return (
    <Box flex={1} p={4} bg={boxBg} borderRadius="md" shadow="lg" width="100%">
      <VStack spacing={6} align="stretch" width="100%">
        {/* Timer, Settings Icon, and Version Control */}
        <Stack direction="row" justifyContent="space-between" align="center">
          {data?.contest?.endTime && (
            <TimerDisplay endTime={data?.contest?.endTime} />
          )}
          <HStack spacing={4} align="center">
            <HStack spacing={2} align="center">
              <Icon as={FaClock} color="blue.500" w={4} h={4} />
              <Text fontSize="sm">Inactive Time: {inactiveTime}s</Text>
            </HStack>
            <HStack spacing={2} align="center">
              <Icon as={FaSync} color="green.500" w={4} h={4} />
              <Text fontSize="sm">Tab Changes: {tabChangeCount}</Text>
            </HStack>
            {/* Version Control Menu */}
            {(combinedRecord.length > 0 || solvedQuestions.length > 0) && (
              <Menu>
                <MenuButton
                  as={Button}
                  leftIcon={<FaHistory />}
                  variant="ghost"
                  size="md"
                  _hover={{ bg: useColorModeValue("gray.200", "gray.600") }}
                />
                <MenuList>
                  {solvedQuestions.length > 0 &&
                    solvedQuestions.map((record) => (
                      <MenuItem
                        key={record.id}
                        onClick={() => handleVersionSelect(record)}
                      >
                        <Text fontSize="sm">
                          {new Date(record.solvedAt).toLocaleString()} -{" "}
                          {record.testCase === "PASSED" ? (
                            <Text as="span" color="green.500">
                              Passed
                            </Text>
                          ) : (
                            <Text as="span" color="red.500">
                              Failed
                            </Text>
                          )}{" "}
                          - Marks: {record.obtainedMarks}/{record.questionMark}
                        </Text>
                      </MenuItem>
                    ))}
                  {combinedRecord.map((record) => (
                    <MenuItem
                      key={record.id}
                      onClick={() => handleVersionSelect(record)}
                    >
                      <Text fontSize="sm">
                        {new Date(record.solvedAt).toLocaleString()} -{" "}
                        {record.testCase === "PASSED" ? (
                          <Text as="span" color="green.500">
                            Passed
                          </Text>
                        ) : (
                          <Text as="span" color="red.500">
                            Failed
                          </Text>
                        )}
                      </Text>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            )}
          </HStack>
          <IconButton
            icon={<FiSettings />}
            aria-label="Settings"
            variant="ghost"
            size="lg"
            onClick={() => setIsSettingsOpen(true)}
            _hover={{ bg: useColorModeValue("gray.200", "gray.600") }}
          />
        </Stack>

        {/* Resizable Code Editor */}
        <Box
          position="relative"
          borderRadius="lg"
          border={`1px solid ${borderColor}`}
          bg={useColorModeValue("white", "gray.900")}
          shadow="md"
          width="100%"
          height="70vh"
        >
          <MonacoEditor
            options={{
              minimap: { enabled: preferences.showSnippets },
              fontSize: fontSize,
              wordWrap: "on",
              lineNumbers: preferences.showLineNumbers ? "on" : "off",
            }}
            height="100%"
            width="100%"
            theme={theme}
            language={preferences.language}
            onMount={onMount}
            value={value}
            onChange={(v) => setValue(v)}
          />
        </Box>

        {/* Output Section */}
        <Box
          borderRadius="lg"
          p={4}
          border={`1px solid ${borderColor}`}
          bg={outputBg}
          shadow="lg"
          transition="all 0.3s"
          _hover={{
            shadow: "xl",
          }}
        >
          <Output
            editorRef={editorRef}
            language={preferences.language}
            inputData={question?.input}
            expectedOutput={question?.expectedOutput}
          />
        </Box>

        <TestResultsDrawer
          isLoading={isLoading}
          isDrawerOpen={isDrawerOpen}
          toggleDrawer={toggleDrawer}
          testResults={testResults}
        />
      </VStack>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        setPreferences={setPreferences}
        theme={theme}
        setTheme={setTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
        layout={layout}
        setLayout={setLayout}
        onLanguageChange={handleLanguageChange}
      />
    </Box>
  );
};

export default React.memo(CodeWorkspace);
