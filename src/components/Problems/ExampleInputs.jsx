// ExampleInputs.jsx
import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const ExampleInputs = ({
  examples,
  newExample,
  setExamples,
  setNewExample,
  toast,
}) => {
  // Handle adding a new example
  const handleAddExample = () => {
    if (
      newExample.input.trim() === "" ||
      newExample.output.trim() === "" ||
      newExample.explanation.trim() === ""
    ) {
      toast({
        title: "Error",
        description: "All example fields must be filled out.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setExamples([...examples, newExample]);
    

    setNewExample({
      input: "",
      output: "",
      explanation: "",
    });
  };

  // Handle removing an existing example
  const handleRemoveExample = (indexToRemove) => {
    setExamples(examples.filter((_, index) => index !== indexToRemove));
  };

  return (
    <FormControl mb={4}>
      <FormLabel>Examples</FormLabel>
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
            aria-label="Close"
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
      <Button type="button" colorScheme="blue" onClick={handleAddExample}>
        Add Example
      </Button>
    </FormControl>
  );
};

export default React.memo(ExampleInputs);
