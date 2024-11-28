import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Badge,
  VStack,
  Heading,
  Spinner,
  useColorModeValue,
  Icon,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTop20RankedStudents } from "../../redux/QuestionSolvedSplice";
import { FaCrown, FaMedal, FaStar, FaTrophy } from "react-icons/fa";
import { keyframes } from "@emotion/react";
import StudentDetailsModal from "./StudentDetailsModal"; // Modal Component
import { getStudentById } from "../../redux/apiSlice";
import { fetchStudentById } from "../../redux/Student/studentsSlice";

const Leaderboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null); // Selected student for modal
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal state management

  useEffect(() => {
    dispatch(fetchTop20RankedStudents()).finally(() => setLoading(false));
  }, [dispatch]);

  const { topRankedStudents } = useSelector((store) => store.solved);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const primaryColor = useColorModeValue("teal.500", "teal.300");

  // Animation for floating effect
  const float = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  `;

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh" bg={bgColor}>
        <Spinner size="xl" thickness="4px" color={primaryColor} />
        <Text ml={4} fontSize="lg" color={primaryColor}>
          Loading Leaderboard...
        </Text>
      </Flex>
    );
  }

  const handleOpenModal = async (studentData) => {
    const response = await dispatch(fetchStudentById(studentData.studentId));
    if (response?.payload) {
      setSelectedStudent(response.payload); // Use the fetched student data
      onOpen();
    }
  };

  return (
    <Box bg={bgColor} minH="100vh" py={6}>
      <Box
        w={{ base: "90vw", md: "70vw" }}
        maxW="800px"
        bg={cardBgColor}
        p={6}
        borderRadius="lg"
        boxShadow="2xl"
        mx="auto"
      >
        <Heading
          fontSize={{ base: "2xl", md: "3xl" }}
          mb={8}
          textAlign="center"
          color={primaryColor}
          fontWeight="bold"
        >
          🏆 Leaderboard 🏆
        </Heading>

        {/* Podium Section */}
        <Flex
          justify="space-around"
          align="center"
          mb={8}
          direction={{ base: "column-reverse", md: "row" }}
          textAlign="center"
        >
          {[1, 0, 2].map((rank, index) => (
            <Box
              key={rank}
              textAlign="center"
              w={{ base: "90%", md: "30%" }}
              p={4}
              borderRadius="lg"
              bgGradient={
                rank === 0
                  ? "linear(to-b, red.400, red.300)"
                  : rank === 1
                  ? "linear(to-b, teal.500, teal.300)"
                  : "linear(to-b, orange.400, orange.300)"
              }
              boxShadow="xl"
              animation={`${float} ${3 + index * 0.5}s infinite`}
              position="relative"
            >
              <Box position="relative" display="inline-block">
                <Avatar
                  size="2xl"
                  bg="gold"
                  borderWidth="4px"
                  borderColor="gold"
                  cursor="pointer"
                  onClick={() => handleOpenModal(topRankedStudents[rank])}
                />
                <Box
                  position="absolute"
                  bottom="-10px"
                  right="-10px"
                  bg="white"
                  borderRadius="full"
                  p={2}
                  boxShadow="lg"
                >
                  <Icon
                    as={rank === 0 ? FaCrown : rank === 1 ? FaMedal : FaStar}
                    boxSize={6}
                    color={
                      rank === 0
                        ? "yellow.500"
                        : rank === 1
                        ? "teal.300"
                        : "orange.400"
                    }
                  />
                </Box>
              </Box>
              {topRankedStudents[rank]?.studentName && (
                <Tooltip label="Click for details" placement="top">
                  <Text
                    fontWeight="bold"
                    fontSize="lg"
                    color="white"
                    cursor="pointer"
                    onClick={() => handleOpenModal(topRankedStudents[rank])}
                  >
                    {topRankedStudents[rank].studentName}
                  </Text>
                </Tooltip>
              )}
              {topRankedStudents[rank]?.branchCode && (
                <Text fontSize="md" color="white">
                  {topRankedStudents[rank].branchCode}
                </Text>
              )}
              {topRankedStudents[rank]?.totalScore && (
                <Text fontSize="sm" color="white">
                  {topRankedStudents[rank].totalScore} pts
                </Text>
              )}
              <Badge
                colorScheme="yellow"
                mt={2}
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
              >
                Rank #{rank + 1}
              </Badge>
            </Box>
          ))}
        </Flex>

        {/* Other Rankings */}
        <VStack spacing={4} align="stretch">
          {topRankedStudents.slice(3).map((student, index) => (
            <Flex
              key={student.id}
              bg={cardBgColor}
              p={4}
              borderRadius="md"
              boxShadow="md"
              align="center"
              justify="space-between"
              _hover={{
                boxShadow: "lg",
                transform: "scale(1.03)",
                transition: "all 0.3s",
              }}
            >
              <Flex align="center">
                <Tooltip label="Click for details" placement="top">
                  <Avatar
                    size="lg"
                    mr={4}
                    name={student.studentName}
                    bgGradient="linear(to-r, teal.400, blue.500)"
                    cursor="pointer"
                    onClick={() => handleOpenModal(student)}
                  />
                </Tooltip>
                <Box>
                  <Tooltip label="Click for details" placement="top">
                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      color={primaryColor}
                      cursor="pointer"
                      onClick={() => handleOpenModal(student)}
                    >
                      {student.studentName}
                    </Text>
                  </Tooltip>
                  <Text fontSize="sm" color="gray.500">
                    {student.branchCode}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {student.totalScore} pts
                  </Text>
                </Box>
              </Flex>
              <Badge
                colorScheme="purple"
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
              >
                #{index + 4}
              </Badge>
            </Flex>
          ))}
        </VStack>

        {/* Modal */}
        {selectedStudent && (
          <StudentDetailsModal
            isOpen={isOpen}
            onClose={onClose}
            student={selectedStudent}
          />
        )}
      </Box>
    </Box>
  );
};

export default Leaderboard;
