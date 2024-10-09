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
  useColorModeValue,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { postQuestion } from "../redux/apiSlice";

import ExampleInputs from "../components/Problems/ExampleInputs";
import { formDataValidator } from "../components/Problems/formDataValidator";

const dsaTopics = [
  { value: "array", label: "Array" },
  { value: "linked-list", label: "Linked List" },
  { value: "stack", label: "Stack" },
  { value: "queue", label: "Queue" },
  { value: "tree", label: "Tree" },
  { value: "graph", label: "Graph" },
  { value: "hashing", label: "Hashing" },
  { value: "dynamic-programming", label: "Dynamic Programming" },
  { value: "greedy", label: "Greedy" },
  { value: "recursion", label: "Recursion" },
  { value: "sorting", label: "Sorting" },
  { value: "searching", label: "Searching" },
  { value: "two-pointer", label: "Two Pointer" },
  { value: "sliding-window", label: "Sliding Window" },
  { value: "bit-manipulation", label: "Bit Manipulation" },
  { value: "divide-and-conquer", label: "Divide and Conquer" },
  { value: "backtracking", label: "Backtracking" },
  { value: "mathematics", label: "Mathematics" },
  { value: "number-theory", label: "Number Theory" },
  { value: "graph-traversal", label: "Graph Traversal (BFS/DFS)" },
  { value: "minimum-spanning-tree", label: "Minimum Spanning Tree" },
  { value: "shortest-path", label: "Shortest Path" },
  { value: "binary-search", label: "Binary Search" },
  { value: "heap", label: "Heap" },
  { value: "trie", label: "Trie" },
  { value: "floyd-warshall", label: "Floyd-Warshall Algorithm" },
  { value: "bellman-ford", label: "Bellman-Ford Algorithm" },
  { value: "kmp", label: "KMP String Matching Algorithm" },
  { value: "dp-on-trees", label: "Dynamic Programming on Trees" },
  { value: "tree-traversal", label: "Tree Traversal (Pre/In/Post Order)" },
  { value: "prime-numbers", label: "Prime Numbers (Sieve of Eratosthenes)" },
  { value: "recursion-vs-iteration", label: "Recursion vs Iteration" },
  { value: "memoization", label: "Memoization" },
  { value: "knapsack", label: "Knapsack Problem" },
  { value: "game-theory", label: "Game Theory" },
  { value: "geometry", label: "Computational Geometry" },
  { value: "probability", label: "Probability & Combinatorics" },
  { value: "conditionals", label: "Conditionals (If/Else)" },
  { value: "loops", label: "Loops (For/While)" },
  { value: "functions", label: "Functions" },
  { value: "variables", label: "Variables" },
  { value: "pointers", label: "Pointers" },
  { value: "object-oriented", label: "Object-Oriented Programming" },
  { value: "functional-programming", label: "Functional Programming" },
  { value: "complexity-analysis", label: "Complexity Analysis (Big O)" },
];

const AddQuestions = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.data);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficultLevel: "",
    constraintValue: "",
    input: "",
    expectedOutput: "",
    tag: "",
    userId: user?.id,
  });

  const [examples, setExamples] = useState([]);
  const [newExample, setNewExample] = useState({
    input: "",
    output: "",
    explanation: "",
  });

  const [errors, setErrors] = useState({});
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

  const handleTagChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      tag: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      tag: false,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    const validationErrors = formDataValidator(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Failed to Add Question",
        description: "Please fill all fields correctly.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      await dispatch(
        postQuestion({
          ...formData,
          user: {
            id: Number(user.id),
          },
          examples,
        })
      ).unwrap();

      setFormData({
        title: "",
        description: "",
        difficultLevel: "",
        constraintValue: "",
        input: "",
        expectedOutput: "",
        tag: "",
        userId: user?.id,
      });
      setExamples([]);

      // Show success toast
      toast({
        title: "Question Added",
        description: "Your question has been successfully added!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      // Handle errors when the API request fails
      toast({
        title: "Failed to Add Question",
        description:
          err.message || "An error occurred while adding the question.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  // Using color modes to enhance UI
  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const formLabelColor = useColorModeValue("teal.600", "teal.200");

  return (
    <Box p={6} bg={bgColor} borderRadius="lg" boxShadow="xl">
      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isInvalid={errors.title}>
          <FormLabel color={formLabelColor}>Title</FormLabel>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            bg={useColorModeValue("gray.50", "gray.800")}
            color={textColor}
          />
        </FormControl>
        <FormControl mb={4} isInvalid={errors.description}>
          <FormLabel color={formLabelColor}>Description</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            ref={textAreaRefs.description}
            style={{ minHeight: "100px", resize: "none" }}
            bg={useColorModeValue("gray.50", "gray.800")}
            color={textColor}
          />
        </FormControl>
        <FormControl mb={4} isInvalid={errors.difficultLevel}>
          <FormLabel color={formLabelColor}>Difficult Level</FormLabel>
          <Select
            name="difficultLevel"
            value={formData.difficultLevel}
            onChange={handleChange}
            bg={useColorModeValue("gray.50", "gray.800")}
            color={textColor}
          >
            <option value="">Select</option>
            <option value="EASY">EASY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HARD">HARD</option>
          </Select>
        </FormControl>
        <FormControl mb={4} isInvalid={errors.constraintValue}>
          <FormLabel color={formLabelColor}>Constraint Value</FormLabel>
          <Input
            type="text"
            name="constraintValue"
            value={formData.constraintValue}
            onChange={handleChange}
            bg={useColorModeValue("gray.50", "gray.800")}
            color={textColor}
          />
        </FormControl>
        <FormControl mb={4} isInvalid={errors.input}>
          <FormLabel color={formLabelColor}>Input</FormLabel>
          <Textarea
            name="input"
            value={formData.input}
            onChange={handleChange}
            ref={textAreaRefs.input}
            style={{ minHeight: "100px", resize: "none" }}
            bg={useColorModeValue("gray.50", "gray.800")}
            color={textColor}
          />
        </FormControl>
        <FormControl mb={4} isInvalid={errors.expectedOutput}>
          <FormLabel color={formLabelColor}>Expected Output</FormLabel>
          <Textarea
            name="expectedOutput"
            value={formData.expectedOutput}
            onChange={handleChange}
            ref={textAreaRefs.expectedOutput}
            style={{ minHeight: "100px", resize: "none" }}
            bg={useColorModeValue("gray.50", "gray.800")}
            color={textColor}
          />
        </FormControl>
        <FormControl mb={4} isInvalid={errors.tag}>
          <FormLabel color={formLabelColor}>Tag (Select a Topic)</FormLabel>
          <Select
            name="tag"
            value={formData.tag}
            onChange={handleTagChange}
            bg={useColorModeValue("gray.50", "gray.800")}
            color={textColor}
          >
            <option value="">Select a topic</option>
            {dsaTopics.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </Select>
        </FormControl>
        <ExampleInputs
          examples={examples}
          newExample={newExample}
          setExamples={setExamples}
          setNewExample={setNewExample}
          toast={toast}
        />
        <Button type="submit" colorScheme="teal" mt={4}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default AddQuestions;
