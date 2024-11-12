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

import ProblemItem from "../components/Problems/ProblemItem";
import ProblemsLoadSpinner from "../components/Spinner/ProblemsLoadSpinner";
import { fetchQuestions } from "../redux/Question/questionApi";
import { Topics } from "../components/data/Dsa";

const Problems = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("");

  // Stable selection of user and question data from store without conditional statements
  const data = useSelector((store) => store.data);
  const question = useSelector((store) => store.question);
  const currentUserId = data?.user?.id;
  const currentUserRole = data?.user?.role;

  // Fetch questions and manage loading
  useEffect(() => {
    dispatch(fetchQuestions());
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Handle filter change for topics
  const handleTopicChange = (e) => setSelectedTopic(e.target.value);

  // Conditional rendering outside of hooks
  if (loading || data.loading || question.loading) {
    return <ProblemsLoadSpinner />;
  }

  // Filter questions based on selected topic
  const filteredQuestions = selectedTopic
    ? question.questions.filter((q) =>
        q.tag?.toLowerCase().includes(selectedTopic.toLowerCase())
      )
    : question.questions;

  // Render component
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
            {Topics().map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </Select>
        </HStack>
      </HStack>
      <List spacing={4}>
        {filteredQuestions.map((question, index) => (
          <ProblemItem
            key={index}
            question={question}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
          />
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
