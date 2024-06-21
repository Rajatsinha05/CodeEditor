import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Text,
  Input,
  useToast,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  Spinner,
  VStack,
  HStack,
  Icon,
  Flex
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { executeCode } from "../api";
import Cookie from "js-cookie";

const Output = ({ editorRef, language, inputData, expectedOutput }) => {
  console.log('{ editorRef, language, inputData, expectedOutput }: ', { editorRef, language, inputData, expectedOutput });
  
  const toast = useToast();
  const [output, setOutput] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(Cookie.get("token"));
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setInput((prevInput) => prevInput + "\n");
    }
  };

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);
      const result = await executeCode(language, sourceCode, input);
      
      const resultOutput = result.output
        .split("\n")
        .filter((line) => line.trim() !== "");

      setOutput(resultOutput);
      setIsError(!!result.stderr);
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);
      const result = await executeCode(language, sourceCode, inputData);
      
      const resultOutput = result.output
        .split("\n")
        .filter((line) => line.trim() !== "");

      setOutput(resultOutput);

      // Flatten and split the expectedOutput array
      const expectedOutputs = expectedOutput
        .flatMap(e => e.split("\n"))
        .filter((line) => line.trim() !== "");

      const results = resultOutput.map((output, index) => ({
        output,
        expected: expectedOutputs[index] || "",
        passed: output === expectedOutputs[index],
      }));
      setTestResults(results);

      setIsError(!!result.stderr);
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
      setIsDrawerOpen(true);
    }
  };

  const clearOutput = () => {
    setOutput(null);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box w="100%" h="fit-content" p={4}>
      <Text mb={2} fontSize="lg">
        Output
      </Text>
      <Box
        h="fit-content"
        p={4}
        bg={isError ? "red.50" : "gray.800"}
        color={isError ? "red.400" : "gray.100"}
        border="1px solid"
        borderRadius="md"
        borderColor={isError ? "red.500" : "gray.700"}
      >
        {output
          ? output.map((line, i) => <Text key={i}>{line}</Text>)
          : 'Click "Run Code" to see the output here'}
      </Box>
      <Input
        placeholder="Enter input here..."
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        mt={4}
        mb={4}
        bg="gray.700"
        color="gray.100"
        borderColor="gray.600"
      />
      <HStack spacing={4}>
        <Button
          variant="solid"
          colorScheme="teal"
          isLoading={isLoading}
          onClick={runCode}
        >
          Run Code
        </Button>
        <Button variant="outline" colorScheme="teal" onClick={submitCode}>
          Submit
        </Button>
      </HStack>
      {/* Drawer Component */}
      <Drawer
        placement="right"
        onClose={toggleDrawer}
        isOpen={isDrawerOpen}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent bg="gray.900" color="gray.100">
          <DrawerCloseButton />
          <DrawerHeader bg="teal.500" color="white">
            Test Cases Result
          </DrawerHeader>
          <DrawerBody>
            {isLoading ? (
              <Flex justify="center" align="center" h="100%">
                <Spinner size="xl" color="teal.500" />
              </Flex>
            ) : (
              <VStack spacing={4} align="stretch">
                {testResults.map((test, index) => (
                  <Box
                    key={index}
                    p={4}
                    borderRadius="md"
                    bg={test.passed ? "green.100" : "red.100"}
                    display="flex"
                    alignItems="center"
                  >
                    <Icon
                      as={test.passed ? CheckCircleIcon : WarningIcon}
                      color={test.passed ? "green.500" : "red.500"}
                      mr={4}
                      boxSize={6}
                    />
                    <Box>
                      <Text fontWeight="bold" color="gray.800">
                        {test.passed ? "Passed" : "Failed"}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Expected: {test.expected}, Got: {test.output}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Output;
