import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContests, fetchContestsByStudent } from "../redux/contestSlice";
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Divider,
  useColorMode,
  useColorModeValue,
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tag,
  Avatar,
  Flex,
  Icon,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {
  CalendarIcon,
  TimeIcon,
  RepeatIcon,
  InfoOutlineIcon,
} from "@chakra-ui/icons";
import {
  MdFilterList,
  MdPlayArrow,
  MdEventAvailable,
  MdRule,
  MdOutlineTimer,
} from "react-icons/md";
import { FaFlagCheckered } from "react-icons/fa";

dayjs.extend(duration);

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const [filter, setFilter] = useState("active");
  const [timers, setTimers] = useState({}); // Store countdown timers for upcoming contests
  const { isLogin, user } = useSelector((store) => store.data);
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal controls
  const [selectedContest, setSelectedContest] = useState(null); // Store selected contest details

  // Fetch contests when component mounts
  useEffect(() => {
    if (user.role === "STUDENT") {
      dispatch(fetchContestsByStudent(user.id));
    } else {
      dispatch(fetchContests());
    }
  }, [dispatch, user]);

  // Get contests from Redux store
  const { contests } = useSelector((store) => store.contest);

  // Helper functions to determine contest status
  const isContestActive = (startTime, endTime) => {
    const currentTime = dayjs();
    return (
      currentTime.isAfter(dayjs(startTime)) &&
      currentTime.isBefore(dayjs(endTime))
    );
  };

  const isContestUpcoming = (startTime) => {
    const currentTime = dayjs();
    return currentTime.isBefore(dayjs(startTime));
  };

  const isContestPast = (endTime) => {
    const currentTime = dayjs();
    return currentTime.isAfter(dayjs(endTime));
  };

  // Handle contest navigation
  const handleContestClick = (contestId) => {
    navigate(`/contest/${contestId}`);
  };

  // Handle opening the start contest modal
  const handleStartContestClick = (contest) => {
    setSelectedContest(contest);
    onOpen();
  };

  // Filter contests based on selected filter
  const filteredContests = Array.isArray(contests)
  ? contests.filter((contest) => {
      if (filter === "active")
        return isContestActive(contest.startTime, contest.endTime);
      if (filter === "upcoming") return isContestUpcoming(contest.startTime);
      if (filter === "past") return isContestPast(contest.endTime);
      return true;
    })
  : [];


  // Function to calculate and format the countdown for upcoming contests
  const calculateCountdown = (startTime) => {
    const timeLeft = dayjs(startTime).diff(dayjs());
    const duration = dayjs.duration(timeLeft);
    return `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
  };

  useEffect(() => {
    if (!Array.isArray(contests)) return;
  
    const intervalId = setInterval(() => {
      const newTimers = {};
      contests.forEach((contest) => {
        if (isContestUpcoming(contest.startTime)) {
          newTimers[contest.id] = calculateCountdown(contest.startTime);
        }
      });
      setTimers(newTimers);
    }, 1000);
  
    return () => clearInterval(intervalId);
  }, [contests]);
  

  // Dynamic styles based on color mode
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.100");
  const dividerColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      p={8}
      maxW="1000px"
      mx="auto"
      bg={bgColor}
      borderRadius="lg"
      shadow="md"
    >
      <HStack justify="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Contests
        </Text>
        <Tooltip label="Filter Contests" aria-label="Filter Contests">
          <IconButton
            icon={<MdFilterList />}
            onClick={() => setFilter("all")}
            aria-label="Filter"
            colorScheme="teal"
            variant="outline"
          />
        </Tooltip>
      </HStack>

      {/* Filter Buttons */}
      <HStack mb={6} spacing={4}>
        <Tooltip label="Active Contests" aria-label="Active Contests">
          <Button
            leftIcon={<MdEventAvailable />}
            colorScheme={filter === "active" ? "teal" : "gray"}
            onClick={() => setFilter("active")}
          >
            Active
          </Button>
        </Tooltip>
        <Tooltip label="Upcoming Contests" aria-label="Upcoming Contests">
          <Button
            leftIcon={<CalendarIcon />}
            colorScheme={filter === "upcoming" ? "yellow" : "gray"}
            onClick={() => setFilter("upcoming")}
          >
            Upcoming
          </Button>
        </Tooltip>
        <Tooltip label="Past Contests" aria-label="Past Contests">
          <Button
            leftIcon={<RepeatIcon />}
            colorScheme={filter === "past" ? "red" : "gray"}
            onClick={() => setFilter("past")}
          >
            Past
          </Button>
        </Tooltip>
      </HStack>

      <Divider borderColor={dividerColor} mb={6} />

      {/* Contests List */}
      <VStack spacing={4} align="stretch">
        {filteredContests.length > 0 ? (
          filteredContests.map((contest) => {
            const contestActive = isContestActive(
              contest.startTime,
              contest.endTime
            );
            const contestUpcoming = isContestUpcoming(contest.startTime);
            const contestPast = isContestPast(contest.endTime);

            const titleColor = contestActive
              ? "teal.500"
              : contestUpcoming
              ? "yellow.500"
              : "red.500";

            return (
              <Box
                key={contest.id}
                borderWidth="1px"
                borderColor={dividerColor}
                borderRadius="md"
                p={6}
                bg={cardBgColor}
                shadow="md"
                _hover={{
                  transform: "scale(1.02)",
                  transition: "0.3s",
                  cursor: "pointer",
                }}
              >
                <Text fontSize="xl" fontWeight="bold" color={titleColor}>
                  {contest.title}
                </Text>
                <Text fontSize="md" color={textColor} mt={2}>
                  {contest.description}
                </Text>
                <Stack mt={3} spacing={4}>
                  <HStack>
                    <Icon as={CalendarIcon} color="teal.500" />
                    <Text fontSize="sm" color={textColor}>
                      Starts:{" "}
                      {dayjs(contest.startTime).format("YYYY-MM-DD hh:mm A")}
                    </Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaFlagCheckered} color="red.500" />
                    <Text fontSize="sm" color={textColor}>
                      Ends:{" "}
                      {dayjs(contest.endTime).format("YYYY-MM-DD hh:mm A")}
                    </Text>
                  </HStack>
                </Stack>
                <Divider my={4} borderColor={dividerColor} />

                {/* Conditionally show contest status or Start button */}
                {contestActive && (
                  <Tooltip label="Start Contest" aria-label="Start Contest">
                    <Button
                      mt={4}
                      colorScheme="teal"
                      onClick={() => handleStartContestClick(contest)}
                      leftIcon={<MdPlayArrow />}
                    >
                      Start Contest
                    </Button>
                  </Tooltip>
                )}
                {contestUpcoming && (
                  <Box mt={4} color="yellow.500" fontWeight="bold">
                    <Text>Contest starts in: {timers[contest.id]}</Text>
                  </Box>
                )}
                {contestPast && (
                  <Text mt={4} color="red.500" fontWeight="bold">
                    Contest has ended
                  </Text>
                )}
              </Box>
            );
          })
        ) : (
          <Text color={textColor}>
            No contests available for the selected filter.
          </Text>
        )}
      </VStack>

      {/* Start Contest Modal */}
      {selectedContest && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Flex alignItems="center">
                <Avatar size="sm" mr={3} />
                Contest Details and Rules
              </Flex>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontSize="2xl" fontWeight="bold" mb={2}>
                {selectedContest.title}
              </Text>
              <Text fontSize="md" color={textColor}>
                {selectedContest.description}
              </Text>
              <Divider my={4} />
              <HStack mb={4}>
                <Icon as={InfoOutlineIcon} w={5} h={5} color="blue.500" />
                <Text fontSize="md" fontWeight="semibold">
                  General Information:
                </Text>
              </HStack>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm">
                  <Icon as={CalendarIcon} mr={2} color="teal.500" /> Start Time:{" "}
                  {dayjs(selectedContest.startTime).format(
                    "YYYY-MM-DD hh:mm A"
                  )}
                </Text>
                <Text fontSize="sm">
                  <Icon as={FaFlagCheckered} mr={2} color="red.500" /> End Time:{" "}
                  {dayjs(selectedContest.endTime).format("YYYY-MM-DD hh:mm A")}
                </Text>
                <Text fontSize="sm">
                  <Icon as={MdEventAvailable} mr={2} color="cyan.500" />{" "}
                  Participation: Open to all registered students
                </Text>
              </VStack>
              <Divider my={4} />
              <HStack mb={2}>
                <Icon as={MdRule} w={5} h={5} color="orange.500" />
                <Text fontSize="md" fontWeight="semibold">
                  Contest Rules:
                </Text>
              </HStack>
              <VStack align="start" spacing={2} pl={6}>
                <Text fontSize="sm">
                  1. Be respectful to other participants.
                </Text>
                <Text fontSize="sm">
                  2. Do not engage in any form of cheating.
                </Text>
                <Text fontSize="sm">
                  3. Complete the contest within the given time frame.
                </Text>
                <Text fontSize="sm">
                  4. Do not close the browser during the contest.
                </Text>
              </VStack>
              <Divider my={4} />
              <Text fontSize="md" fontWeight="bold" color="teal.500" mt={4}>
                Good Luck!
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="teal"
                onClick={() => handleContestClick(selectedContest.id)}
              >
                Proceed
              </Button>
              <Button variant="ghost" onClick={onClose} ml={3}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default Home;
