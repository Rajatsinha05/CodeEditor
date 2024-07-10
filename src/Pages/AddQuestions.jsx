import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { postQuestion } from "../redux/apiSlice";

const AddQuestions = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficultLevel: "",
    constraintValue: "",
    input: "",
    expectedOutput: "",
    tags: "",
  });

  const [examples, setExamples] = useState([]);
  const [newExample, setNewExample] = useState({
    input: "",
    output: "",
    explanation: "",
  });

  const [errors, setErrors] = useState({
    title: false,
    description: false,
    difficultLevel: false,
    constraintValue: false,
    input: false,
    expectedOutput: false,
    tags: false,
  });

  const toast = useToast();
  const textAreaRefs = {
    description: useRef(null),
    input: useRef(null),
    expectedOutput: useRef(null),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error if the user starts typing after an error
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  };

  useEffect(() => {
    const adjustTextareaHeight = (ref) => {
      if (ref.current) {
        ref.current.style.height = "auto";
        ref.current.style.height = ref.current.scrollHeight + "px";
      }
    };

    adjustTextareaHeight(textAreaRefs.description);
    adjustTextareaHeight(textAreaRefs.input);
    adjustTextareaHeight(textAreaRefs.expectedOutput);
  }, [formData]);

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

  const handleRemoveExample = (indexToRemove) => {
    setExamples(examples.filter((_, index) => index !== indexToRemove));
  };

  const { user } = useSelector((store) => store.data);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    const validationErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        validationErrors[key] = true;
        isValid = false;
      }
    });

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    dispatch(
      postQuestion({
        ...formData,
        examples,
        user: {
          id: Number(user.id),
        },
      })
    );

    setFormData({
      title: "",
      description: "",
      difficultLevel: "",
      constraintValue: "",
      input: "",
      expectedOutput: "",
      tags: "",
    });
    setExamples([]);

    // Show success toast
    toast({
      title: "Question Added",
      description: "Your question has been successfully added!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isInvalid={errors.title}>
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl mb={4} isInvalid={errors.description}>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            ref={textAreaRefs.description}
            style={{ minHeight: "100px", resize: "none" }}
          />
        </FormControl>
        <FormControl mb={4} isInvalid={errors.difficultLevel}>
          <FormLabel>Difficult Level</FormLabel>
          <Select
            name="difficultLevel"
            value={formData.difficultLevel}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="EASY">EASY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HARD">HARD</option>
          </Select>
        </FormControl>
        <FormControl mb={4} isInvalid={errors.constraintValue}>
          <FormLabel>Constraint Value</FormLabel>
          <Input
            type="text"
            name="constraintValue"
            value={formData.constraintValue}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl mb={4} isInvalid={errors.input}>
          <FormLabel>Input</FormLabel>
          <Textarea
            name="input"
            value={formData.input}
            onChange={handleChange}
            ref={textAreaRefs.input}
            style={{ minHeight: "100px", resize: "none" }}
          />
        </FormControl>
        <FormControl mb={4} isInvalid={errors.expectedOutput}>
          <FormLabel>Expected Output</FormLabel>
          <Textarea
            name="expectedOutput"
            value={formData.expectedOutput}
            onChange={handleChange}
            ref={textAreaRefs.expectedOutput}
            style={{ minHeight: "100px", resize: "none" }}
          />
        </FormControl>
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
          <FormControl mb={4}>
            <FormLabel>Add New Example</FormLabel>
            <FormControl mb={2}>
              <Input
                name="newInput"
                value={newExample.input}
                onChange={(e) => setNewExample({ ...newExample, input: e.target.value })}
                placeholder="Input"
              />
            </FormControl>
            <FormControl mb={2}>
              <Textarea
                name="newOutput"
                value={newExample.output}
                onChange={(e) => setNewExample({ ...newExample, output: e.target.value })}
                placeholder="Output"
                style={{ minHeight: "100px", resize: "none" }}
              />
            </FormControl>
            <FormControl mb={2}>
              <Textarea
                name="newExplanation"
                value={newExample.explanation}
                onChange={(e) => setNewExample({ ...newExample, explanation: e.target.value })}
                placeholder="Explanation"
                style={{ minHeight: "100px", resize: "none" }}
              />
            </FormControl>
            <Button type="button" colorScheme="blue" onClick={handleAddExample}>
              Add Example
            </Button>
          </FormControl>
        </FormControl>
        <FormControl mb={4} isInvalid={errors.tags}>
          <FormLabel>Tags</FormLabel>
          <Input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
          />
        </FormControl>
        <Button type="submit" colorScheme="blue">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default AddQuestions;
