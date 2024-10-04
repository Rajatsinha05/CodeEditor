import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Text,
  List,
  Select,
  HStack,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaFilter } from "react-icons/fa";
import { fetchQuestions } from "../redux/apiSlice";
import ProblemItem from "../components/Problems/ProblemItem";
import ProblemsLoadSpinner from "../components/Spinner/ProblemsLoadSpinner";

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
  // Add more topics as needed
];

const Problems = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // State to control the spinner
  const [selectedTopic, setSelectedTopic] = useState(""); // State to control the filter selection

  useEffect(() => {
    dispatch(fetchQuestions());
    // Show spinner for a short duration
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  const { data } = useSelector((store) => store);

  if (loading || data.loading) {
    return <ProblemsLoadSpinner />;
  }

  // Filter the questions based on the selected topic
  const filteredQuestions =
    selectedTopic === ""
      ? data.questions
      : data.questions.filter((question) =>
          question.tag?.toLowerCase().includes(selectedTopic.toLowerCase())
        );

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  return (
    <Box p={4}>
      <HStack justifyContent="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Problems
        </Text>
        <HStack>
          <IconButton
            icon={<FaFilter />}
            aria-label="Filter"
            colorScheme="teal"
            size="md"
            mr={2}
            _hover={{ bg: useColorModeValue("teal.200", "teal.600") }}
          />
          <Select
            placeholder="Filter by Topic"
            onChange={handleTopicChange}
            value={selectedTopic}
            width="200px"
            color={useColorModeValue("gray.700", "gray.300")}
            bg={useColorModeValue("gray.50", "gray.700")}
          >
            {dsaTopics.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </Select>
        </HStack>
      </HStack>
      <List spacing={4}>
        {filteredQuestions.map((question, index) => (
          <ProblemItem key={index} question={question} />
        ))}
      </List>
      {filteredQuestions.length === 0 && (
        <Text color="gray.500" mt={4}>
          No problems found for the selected topic.
        </Text>
      )}
    </Box>
  );
};

export default Problems;
