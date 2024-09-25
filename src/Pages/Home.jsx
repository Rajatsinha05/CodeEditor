import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteContest } from "../redux/contestSlice";
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DeleteIcon, TimeIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { getContests } from "../redux/contestapislice";

dayjs.extend(duration);

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("active");
  const [timers, setTimers] = useState({}); // Store countdown timers for upcoming contests

  // Get the user's role and ID from the Redux store
  const { user } = useSelector((store) => store.data); // Assuming user data is stored in data.user
  const { role, id: userId } = user;

  // Fetch contests when component mounts
  useEffect(() => {
    dispatch(getContests());
  }, [dispatch]);

  // Get contests from Redux store
  const { contests } = useSelector((store) => store.contestApi);

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

  // Handle delete contest
  const handleDeleteContest = (contestId, event) => {
    event.stopPropagation(); // Prevent navigation to contest details
    dispatch(deleteContest(contestId));
    console.log(`Delete contest with id: ${contestId}`);
  };

  // Filter contests based on role and selected filter
  const filteredContests = contests.filter((contest) => {
    if (role === "ADMIN" || role === "SUPERADMIN") {
      // Show all contests for ADMIN or SUPERADMIN
      return true;
    }
    if (role === "STUDENT") {
      // Show only enrolled contests for STUDENT
      return contest.enrolledStudents.includes(Number(userId)); // Ensure `userId` is compared as a number
    }
    return false; // Default to not showing any contests if the role is not recognized
  }).filter((contest) => {
    // Additional filtering based on contest status
    if (filter === "active")
      return isContestActive(contest.startTime, contest.endTime);
    if (filter === "upcoming") return isContestUpcoming(contest.startTime);
    if (filter === "past") return isContestPast(contest.endTime);
    return true;
  });

  // Function to calculate and format the countdown for upcoming contests
  const calculateCountdown = (startTime) => {
    const timeLeft = dayjs(startTime).diff(dayjs());
    const duration = dayjs.duration(timeLeft);
    return `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newTimers = {};
      contests.forEach((contest) => {
        if (isContestUpcoming(contest.startTime)) {
          newTimers[contest._id] = calculateCountdown(contest.startTime);
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
      <Text fontSize="2xl" fontWeight="bold" mb={6} color={textColor}>
        Contests
      </Text>

      {/* Filter Buttons */}
      <HStack mb={6} spacing={4}>
        <Button
          colorScheme={filter === "active" ? "teal" : "gray"}
          onClick={() => setFilter("active")}
        >
          Active
        </Button>
        <Button
          colorScheme={filter === "upcoming" ? "yellow" : "gray"}
          onClick={() => setFilter("upcoming")}
        >
          Upcoming
        </Button>
        <Button
          colorScheme={filter === "past" ? "red" : "gray"}
          onClick={() => setFilter("past")}
        >
          Past
        </Button>
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
                key={contest._id}
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
                onClick={() => handleContestClick(contest._id)}
              >
                <Text fontSize="xl" fontWeight="bold" color={titleColor}>
                  {contest.title}
                </Text>
                <Text fontSize="md" color={textColor}>
                  {contest.description}
                </Text>
                <Text fontSize="sm" color={textColor}>
                  <TimeIcon mr={2} />
                  Starts:{" "}
                  {dayjs(contest.startTime).format("YYYY-MM-DD hh:mm A")}
                </Text>
                <Text fontSize="sm" color={textColor}>
                  <TimeIcon mr={2} />
                  Ends: {dayjs(contest.endTime).format("YYYY-MM-DD hh:mm A")}
                </Text>

                <HStack mt={4} spacing={4}>
                  {/* Conditionally show contest status or Start button */}
                  {contestActive && (
                    <Tooltip
                      label="Start the contest"
                      aria-label="Start contest tooltip"
                    >
                      <Button
                        colorScheme="teal"
                        size="sm"
                        onClick={() => handleContestClick(contest._id)}
                      >
                        Start Contest
                      </Button>
                    </Tooltip>
                  )}
                  {contestUpcoming && (
                    <Box color="yellow.500" fontWeight="bold">
                      <Text>Contest starts in: {timers[contest._id]}</Text>
                    </Box>
                  )}
                  {contestPast && (
                    <Text color="red.500" fontWeight="bold">
                      Contest has ended
                    </Text>
                  )}

                  {/* Conditionally render delete button for admin or superadmin */}
                  {(role === "ADMIN" || role === "SUPERADMIN") && (
                    <Tooltip
                      label="Delete contest"
                      aria-label="Delete contest tooltip"
                    >
                      <IconButton
                        colorScheme="red"
                        aria-label="Delete Contest"
                        icon={<DeleteIcon />}
                        onClick={(e) => handleDeleteContest(contest._id, e)}
                      />
                    </Tooltip>
                  )}
                </HStack>
              </Box>
            );
          })
        ) : (
          <Text color={textColor}>
            No contests available for the selected filter.
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default Home;
