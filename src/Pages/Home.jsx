import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContests } from '../redux/contestSlice';
import { Box, Button, Text, VStack, HStack, Divider, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { colorMode } = useColorMode(); // Chakra UI hook to toggle dark/light modes
    const [filter, setFilter] = useState('active');

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

    // Dynamic styles based on color mode
    const bgColor = useColorModeValue('gray.50', 'gray.800'); // Light/Dark mode background color for the container
    const cardBgColor = useColorModeValue('white', 'gray.700'); // Light/Dark mode background for contest cards
    const textColor = useColorModeValue('gray.700', 'gray.100'); // Light/Dark mode text color
    const dividerColor = useColorModeValue('gray.200', 'gray.600'); // Divider color based on light/dark mode

    return (
        <Box p={8} maxW="1000px" mx="auto" bg={bgColor} borderRadius="lg" shadow="md">
            <Text fontSize="2xl" fontWeight="bold" mb={6} color={textColor}>
                Contests
            </Text>

            {/* Filter Buttons */}
            <HStack mb={6} spacing={4}>
                <Button
                    colorScheme={filter === 'active' ? 'teal' : 'gray'}
                    onClick={() => setFilter('active')}
                >
                    Active
                </Button>
                <Button
                    colorScheme={filter === 'upcoming' ? 'yellow' : 'gray'}
                    onClick={() => setFilter('upcoming')}
                >
                    Upcoming
                </Button>
                <Button
                    colorScheme={filter === 'past' ? 'red' : 'gray'}
                    onClick={() => setFilter('past')}
                >
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

                        // Set color for contest titles based on their status
                        const titleColor = contestActive
                            ? 'teal.500'
                            : contestUpcoming
                                ? 'yellow.500'
                                : 'red.500';

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
                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    color={titleColor}
                                >
                                    {contest.title}
                                </Text>
                                <Text fontSize="md" color={textColor}>
                                    {contest.description}
                                </Text>
                                <Text fontSize="sm" color={textColor}>
                                    Starts: {dayjs(contest.startTime).format('YYYY-MM-DD HH:mm')}
                                </Text>
                                <Text fontSize="sm" color={textColor}>
                                    Ends: {dayjs(contest.endTime).format('YYYY-MM-DD HH:mm')}
                                </Text>

                                {/* Conditionally show contest status or Start button */}
                                {contestActive && (
                                    <Button
                                        mt={4}
                                        colorScheme="teal"
                                        onClick={() => handleContestClick(contest.id)}
                                    >
                                        Start Contest
                                    </Button>
                                )}
                                {contestUpcoming && (
                                    <Text mt={4} color="yellow.500" fontWeight="bold">
                                        Contest not started yet
                                    </Text>
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
        </Box>
    );
};

export default Home;
