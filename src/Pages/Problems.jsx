import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Text,
  List,
  Select,
  HStack,
  IconButton,
  useColorMode,
  useColorModeValue,
  VStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Heading,
  Divider,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { FaFilter, FaSyncAlt, FaMoon, FaSun } from "react-icons/fa";
import ProblemItem from "../components/Problems/ProblemItem";
import { fetchQuestions } from "../redux/Question/questionApi";
import { Topics } from "../components/data/Dsa";

const Problems = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const data = useSelector((store) => store.data);
  const question = useSelector((store) => store.question);
  console.log("question: ", question);
  const currentUserId = data?.user?.id;
  const currentUserRole = data?.user?.role;
  const canEditOrDelete =
    currentUserId === question.userId || currentUserRole === "SUPERADMIN";
  useEffect(() => {
    if (question.questions.length === 0) {
      dispatch(fetchQuestions());
    }
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleTopicChange = (e) => setSelectedTopic(e.target.value);
  const handleDifficultyChange = (e) => setSelectedDifficulty(e.target.value);
  const clearFilters = () => {
    setSelectedTopic("");
    setSelectedDifficulty("");
  };

  const filteredQuestions = question.questions.filter((q) => {
    const matchesTopic =
      selectedTopic === "" ||
      q.tag?.toLowerCase().includes(selectedTopic.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === "" || q.difficulty === selectedDifficulty;
    return matchesTopic && matchesDifficulty;
  });

  if (loading || data.loading || question.loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" color="teal.400" />
      </Center>
    );
  }

  return (
    <Box
      p={6}
      bg={useColorModeValue("gray.50", "gray.900")}
      minH="100vh"
      color={useColorModeValue("gray.800", "gray.200")}
    >
      <VStack spacing={6} align="stretch">
        {/* Header Section */}
        <HStack justifyContent="space-between">
          <Heading size="lg">Question List</Heading>
          <HStack>
            <IconButton
              icon={<FaFilter />}
              aria-label="Open Filters"
              colorScheme="teal"
              size="md"
              onClick={() => setDrawerOpen(true)}
              _hover={{ bg: useColorModeValue("teal.200", "teal.600") }}
            />
          </HStack>
        </HStack>

        {/* Drawer for Filters */}
        <Drawer
          isOpen={isDrawerOpen}
          placement="right"
          onClose={() => setDrawerOpen(false)}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Filter Problems</DrawerHeader>
            <DrawerBody>
              <VStack spacing={4} align="stretch">
                <Select
                  placeholder="Filter by Topic"
                  onChange={handleTopicChange}
                  value={selectedTopic}
                  bg={useColorModeValue("gray.50", "gray.700")}
                  color={useColorModeValue("gray.700", "gray.300")}
                  width="100%"
                  _hover={{
                    borderColor: useColorModeValue("teal.400", "teal.600"),
                  }}
                >
                  {Topics().map((topic) => (
                    <option key={topic.value} value={topic.value}>
                      {topic.label}
                    </option>
                  ))}
                </Select>
                <Select
                  placeholder="Filter by Difficulty"
                  onChange={handleDifficultyChange}
                  value={selectedDifficulty}
                  bg={useColorModeValue("gray.50", "gray.700")}
                  color={useColorModeValue("gray.700", "gray.300")}
                  width="100%"
                  _hover={{
                    borderColor: useColorModeValue("teal.400", "teal.600"),
                  }}
                >
                  {["Easy", "Medium", "Hard"].map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </Select>
                <Button colorScheme="teal" onClick={clearFilters} width="100%">
                  Clear Filters
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        <Divider />

        {/* Problems List */}
        <List spacing={6}>
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
          <Box textAlign="center" mt={6}>
            <Text fontSize="lg" fontWeight="bold">
              No Questions Found
            </Text>
            <Text fontSize="sm" color="gray.500">
              Try adjusting your filters or refreshing the page.
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default React.memo(Problems);
