import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContests } from '../redux/contestSlice';
import { Box, Button, Text, VStack, HStack, Divider, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { colorMode } = useColorMode();
    const [filter, setFilter] = useState('active');
    const [timers, setTimers] = useState({}); // Store countdown timers for upcoming contests

    // Fetch contests when component mounts
    useEffect(() => {
        dispatch(fetchContests());
    }, [dispatch]);

    // Get contests from Redux store
    const { contests } = useSelector((store) => store.contest);

    // Helper functions to determine contest status
    const isContestActive = (startTime, endTime) => {
        const currentTime = dayjs();
        return currentTime.isAfter(dayjs(startTime)) && currentTime.isBefore(dayjs(endTime));
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

    // Filter contests based on selected filter
    const filteredContests = contests.filter((contest) => {
        if (filter === 'active') return isContestActive(contest.startTime, contest.endTime);
        if (filter === 'upcoming') return isContestUpcoming(contest.startTime);
        if (filter === 'past') return isContestPast(contest.endTime);
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
                    newTimers[contest.id] = calculateCountdown(contest.startTime);
                }
            });
            setTimers(newTimers);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [contests]);

    // Dynamic styles based on color mode
    const bgColor = useColorModeValue('gray.50', 'gray.800');
    const cardBgColor = useColorModeValue('white', 'gray.700');
    const textColor = useColorModeValue('gray.700', 'gray.100');
    const dividerColor = useColorModeValue('gray.200', 'gray.600');

    return (
        <Box p={8} maxW="1000px" mx="auto" bg={bgColor} borderRadius="lg" shadow="md">
            <Text fontSize="2xl" fontWeight="bold" mb={6} color={textColor}>
                Contests
            </Text>

            {/* Filter Buttons */}
            <HStack mb={6} spacing={4}>
                <Button colorScheme={filter === 'active' ? 'teal' : 'gray'} onClick={() => setFilter('active')}>
                    Active
                </Button>
                <Button colorScheme={filter === 'upcoming' ? 'yellow' : 'gray'} onClick={() => setFilter('upcoming')}>
                    Upcoming
                </Button>
                <Button colorScheme={filter === 'past' ? 'red' : 'gray'} onClick={() => setFilter('past')}>
                    Past
                </Button>
            </HStack>

            <Divider borderColor={dividerColor} mb={6} />

            {/* Contests List */}
            <VStack spacing={4} align="stretch">
                {filteredContests.length > 0 ? (
                    filteredContests.map((contest) => {
                        const contestActive = isContestActive(contest.startTime, contest.endTime);
                        const contestUpcoming = isContestUpcoming(contest.startTime);
                        const contestPast = isContestPast(contest.endTime);

                        const titleColor = contestActive ? 'teal.500' : contestUpcoming ? 'yellow.500' : 'red.500';

                        return (
                            <Box
                                key={contest.id}
                                borderWidth="1px"
                                borderColor={dividerColor}
                                borderRadius="md"
                                p={6}
                                bg={cardBgColor}
                                shadow="md"
                                _hover={{ transform: 'scale(1.02)', transition: '0.3s', cursor: 'pointer' }}
                                onClick={() => handleContestClick(contest.id)}
                            >
                                <Text fontSize="xl" fontWeight="bold" color={titleColor}>
                                    {contest.title}
                                </Text>
                                <Text fontSize="md" color={textColor}>
                                    {contest.description}
                                </Text>
                                <Text fontSize="sm" color={textColor}>
                                    Starts: {dayjs(contest.startTime).format('YYYY-MM-DD hh:mm A')}
                                </Text>
                                <Text fontSize="sm" color={textColor}>
                                    Ends: {dayjs(contest.endTime).format('YYYY-MM-DD hh:mm A')}
                                </Text>

                                {/* Conditionally show contest status or Start button */}
                                {contestActive && (
                                    <Button mt={4} colorScheme="teal" onClick={() => handleContestClick(contest.id)}>
                                        Start Contest
                                    </Button>
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
                    <Text color={textColor}>No contests available for the selected filter.</Text>
                )}
            </VStack>
        </Box>
    );
};

export default Home;
