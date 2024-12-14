import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  IconButton,
  Button,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { CloseIcon, AddIcon } from "@chakra-ui/icons";
import { showToast } from "../../utils/toastUtils";

const ExampleInputs = ({
  examples,
  newExample,
  setExamples,
  setNewExample,
  toast,
}) => {
  // Handle adding a new example
  const handleAddExample = (e) => {
    e.preventDefault(); // Prevent form submission
    if (
      newExample.input.trim() === "" ||
      newExample.output.trim() === "" ||
      newExample.explanation.trim() === ""
    ) {
      showToast(toast, "All example fields must be filled out.", "error");
      return;
    }

    // Add the new example to the list
    setExamples([...examples, newExample]);

    // Reset the new example fields
    setNewExample({
      input: "",
      output: "",
      explanation: "",
    });
  };

  // Handle removing an existing example
  const handleRemoveExample = (indexToRemove) => {
    const updatedExamples = examples.filter(
      (_, index) => index !== indexToRemove
    );
    setExamples(updatedExamples);
  };

  // Theme-based colors
  const { colorMode } = useColorMode();
  const buttonColor = useColorModeValue("red.300", "teal.200");
  const isDarkMode = colorMode === "dark";

  return (
    <FormControl mb={4}>
      <FormLabel>Examples</FormLabel>
      {/* Render Existing Examples */}
      {examples.map((example, index) => (
        <Box
          key={index}
          border="1px solid #CBD5E0"
          borderRadius="md"
          p={4}
          mb={4}
          position="relative"
        >
          <IconButton
            aria-label="Remove example"
            icon={<CloseIcon />}
            variant="ghost"
            colorScheme="red"
            onClick={() => handleRemoveExample(index)}
            position="absolute"
            top={1}
            right={1}
          />
          <FormLabel mb={2}>Example {index + 1}</FormLabel>
          <FormControl mb={2}>
            <Input
              name={`input${index}`}
              value={example.input}
              onChange={(e) => {
                const updatedExamples = [...examples];
                updatedExamples[index].input = e.target.value;
                setExamples(updatedExamples);
              }}
              placeholder="Input"
            />
          </FormControl>
          <FormControl mb={2}>
            <Textarea
              name={`output${index}`}
              value={example.output}
              onChange={(e) => {
                const updatedExamples = [...examples];
                updatedExamples[index].output = e.target.value;
                setExamples(updatedExamples);
              }}
              placeholder="Output"
              style={{ minHeight: "100px", resize: "none" }}
            />
          </FormControl>
          <FormControl mb={2}>
            <Textarea
              name={`explanation${index}`}
              value={example.explanation}
              onChange={(e) => {
                const updatedExamples = [...examples];
                updatedExamples[index].explanation = e.target.value;
                setExamples(updatedExamples);
              }}
              placeholder="Explanation"
              style={{ minHeight: "100px", resize: "none" }}
            />
          </FormControl>
        </Box>
      ))}

      {/* New Example Fields */}
      <FormLabel>Add New Example</FormLabel>
      <FormControl mb={2}>
        <Input
          name="newInput"
          value={newExample.input}
          onChange={(e) =>
            setNewExample({ ...newExample, input: e.target.value })
          }
          placeholder="Input"
        />
      </FormControl>
      <FormControl mb={2}>
        <Textarea
          name="newOutput"
          value={newExample.output}
          onChange={(e) =>
            setNewExample({ ...newExample, output: e.target.value })
          }
          placeholder="Output"
          style={{ minHeight: "100px", resize: "none" }}
        />
      </FormControl>
      <FormControl mb={2}>
        <Textarea
          name="newExplanation"
          value={newExample.explanation}
          onChange={(e) =>
            setNewExample({ ...newExample, explanation: e.target.value })
          }
          placeholder="Explanation"
          style={{ minHeight: "100px", resize: "none" }}
        />
      </FormControl>

      {/* Add Example Button */}
      <Button
        type="button" // Ensure this button does not trigger form submission
        colorScheme={isDarkMode ? "teal" : "red"}
        bg={buttonColor}
        leftIcon={<AddIcon />}
        _hover={{
          bg: isDarkMode ? "teal.300" : "red.400",
        }}
        _active={{
          bg: isDarkMode ? "teal.400" : "red.500",
        }}
        mt={4}
        onClick={handleAddExample}
      >
        Add Example
      </Button>
    </FormControl>
  );
};

export default React.memo(ExampleInputs);
