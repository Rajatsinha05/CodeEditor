import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Spinner,
  Text,
  Flex,
  Badge,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrophy } from "react-icons/fa";
import { fetchTop20RankedStudents } from "../../redux/QuestionSolvedSplice";

const Rankings = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchTop20RankedStudents()).finally(() => setLoading(false));
  }, [dispatch]);

  const { topRankedStudents } = useSelector((store) => store.solved);

  // Use theme colors for different modes
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const cardTextColor = useColorModeValue("gray.800", "white");

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh" bg={bgColor}>
        <Spinner size="xl" thickness="4px" color="blue.400" />
      </Flex>
    );
  }

  return (
    <Box p={6} maxW="600px" mx="auto" mt={8} bg={bgColor} borderRadius="md" boxShadow="lg">
      <Heading fontSize="3xl" mb={6} textAlign="center" color={useColorModeValue("teal.600", "teal.300")}>
        🏆 Top 20 Students Ranking 🏆
      </Heading>
      <VStack align="stretch" spacing={6}>
        {topRankedStudents.length > 0 ? (
          topRankedStudents.map((student, index) => (
            <Flex
              key={student.id}
              p={4}
              borderRadius="md"
              bg={cardBgColor}
              color={cardTextColor}
              align="center"
              justify="space-between"
              borderWidth="2px"
              borderColor={
                index === 0
                  ? "yellow.400"
                  : index === 1
                  ? "gray.500"
                  : index === 2
                  ? "orange.400"
                  : "blue.500"
              }
              transition="all 0.3s"
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "xl",
              }}
            >
              <Flex align="center">
                <Box mr={4}>
                  <Text fontWeight="bold" fontSize="xl">
                    {index + 1}. {student.studentName}
                  </Text>
                  <Text fontSize="md" color={useColorModeValue("gray.600", "gray.300")}>
                    Total Score: {student.totalScore}
                  </Text>
                </Box>
              </Flex>
              <Badge
                colorScheme={
                  index === 0
                    ? "yellow"
                    : index === 1
                    ? "gray"
                    : index === 2
                    ? "orange"
                    : "teal"
                }
                fontSize="md"
                px={3}
                py={1}
                borderRadius="full"
                textTransform="capitalize"
                display="flex"
                alignItems="center"
                transition="all 0.3s"
                _hover={{ transform: "scale(1.1)" }}
              >
                {index === 0 ? (
                  <>
                    <Icon as={FaTrophy} color="yellow.400" mr={2} transition="color 0.3s" _hover={{ color: "yellow.600" }} />
                    Champion
                  </>
                ) : index === 1 ? (
                  <>
                    <Icon as={FaTrophy} color="gray.500" mr={2} transition="color 0.3s" _hover={{ color: "gray.700" }} />
                    2nd Place
                  </>
                ) : index === 2 ? (
                  <>
                    <Icon as={FaTrophy} color="orange.400" mr={2} transition="color 0.3s" _hover={{ color: "orange.600" }} />
                    3rd Place
                  </>
                ) : (
                  "Participant"
                )}
              </Badge>
            </Flex>
          ))
        ) : (
          <Text fontSize="lg" textAlign="center">
            No rankings available.
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default Rankings;
