import React, { useState } from "react";
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
  DrawerFooter,
  DrawerCloseButton,
  List,
  ListItem,
  Spinner,
} from "@chakra-ui/react";
import { executeCode } from "../api";

const Output = ({ editorRef, language }) => {
  const toast = useToast();
  const [output, setOutput] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to control drawer visibility

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior of the Enter key
      setInput((prevInput) => prevInput + "\n"); // Add a newline character to the input
    }
  };

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    
    try {
      setIsLoading(true);
      const result = await executeCode(language, sourceCode, input);
      console.log("result",result);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
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

  const clearOutput = () => {
    setOutput(null);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box w="100%" h="fit-content">
      <Text mb={2} fontSize="lg">
        Output
      </Text>
      <Box
        h="fit-content"
        p={2}
        color={isError ? "red.400" : ""}
        border="1px solid"
        borderRadius={4}
        borderColor={isError ? "red.500" : "#333"}
      >
        {output ? (
          output.map((line, i) => <Text key={i}>{line}</Text>)
        ) : (
          'Click "Run Code" to see the output here'
        )}
      </Box>
      <Input
        placeholder="Enter input here..."
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        mt={4}
        mb={4}
      />
      <Button
        variant="outline"
        colorScheme="green"
        isLoading={isLoading}
        onClick={runCode}
        mr={2}
      >
        Run Code
      </Button>
      <Button variant="outline" colorScheme="red" onClick={toggleDrawer}>
        Submit
      </Button>
      {/* Drawer Component */}
      <Drawer placement="right" onClose={toggleDrawer} isOpen={isDrawerOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Test Cases Result</DrawerHeader>
          <DrawerBody>
            {isLoading ? (
              <Spinner />
            ) : (
              <List spacing={3}>
                {testResults.map((test, index) => (
                  <ListItem
                    key={index}
                    color={test.passed ? "green.500" : "red.500"}
                  >
                    {test.description} -{" "}
                    {test.passed ? "Passed" : "Failed"} (Expected:{" "}
                    {test.expected}, Got: {test.actual})
                  </ListItem>
                ))}
              </List>
            )}
          </DrawerBody>
         
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Output;
