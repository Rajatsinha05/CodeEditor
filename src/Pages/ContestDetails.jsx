import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getContestById } from '../redux/contestSlice';
import {
    Box, Text, VStack, Divider, List, ListItem, Badge, HStack, Tag, Avatar, Icon, Button, useColorMode, Flex
} from '@chakra-ui/react';
import { CalendarIcon, TimeIcon } from '@chakra-ui/icons';

const ContestDetails = () => {
    const { id } = useParams(); // Get contest ID from the URL
    const dispatch = useDispatch();
    const { colorMode, toggleColorMode } = useColorMode(); // For light/dark mode

    // Fetch contest details when component mounts
    useEffect(() => {
        dispatch(getContestById(id));
    }, [dispatch, id]);

    // Get the specific contest from the store
    const { contest } = useSelector((store) => store.contest);

    const formatDateTime12Hour = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric', 
            hour12: true 
        };
        return new Date(dateString).toLocaleString('en-US', options);
    };

    return (
        <Box p={8} maxW="1000px" mx="auto" bg={colorMode === 'light' ? 'gray.100' : 'gray.800'} borderRadius="lg" shadow="lg">
            {/* Header with theme toggle button */}
            <Flex justify="space-between" align="center" mb={6}>
                <Text fontSize="3xl" fontWeight="bold" color={colorMode === 'light' ? 'teal.600' : 'teal.300'}>
                    {contest.title}
                </Text>
            </Flex>

            {/* Contest Title */}
            <Box mb={6}>
                <Badge colorScheme="purple" fontSize="0.8em" p={1} borderRadius="md">
                    Difficulty: {contest.difficultyLevel}
                </Badge>
            </Box>

            {/* Contest Dates */}
            <HStack mb={6} spacing={4}>
                <HStack>
                    <Icon as={CalendarIcon} color={colorMode === 'light' ? 'gray.500' : 'gray.400'} />
                    <Text fontSize="md" color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                        Starts: {formatDateTime12Hour(contest.startTime)}
                    </Text>
                </HStack>
                <HStack>
                    <Icon as={TimeIcon} color={colorMode === 'light' ? 'gray.500' : 'gray.400'} />
                    <Text fontSize="md" color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                        Ends: {formatDateTime12Hour(contest.endTime)}
                    </Text>
                </HStack>
            </HStack>

            {/* Total Marks */}
            <Box mb={6}>
                <Text fontSize="lg" fontWeight="bold" color={colorMode === 'light' ? 'gray.700' : 'gray.300'}>
                    Total Marks: {contest.totalMarks}
                </Text>
            </Box>

            <Divider borderColor={colorMode === 'light' ? 'gray.300' : 'gray.600'} />

            {/* Contest Description */}
            <Box my={6}>
                <Text fontSize="lg" fontWeight="semibold" mb={2} color={colorMode === 'light' ? 'gray.700' : 'gray.300'}>
                    Description
                </Text>
                <Text fontSize="md" color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                    {contest.description}
                </Text>
            </Box>

            <Divider borderColor={colorMode === 'light' ? 'gray.300' : 'gray.600'} />

            {/* Contest Questions */}
            <Box my={6}>
                <Text fontSize="lg" fontWeight="semibold" mb={4} color={colorMode === 'light' ? 'teal.600' : 'teal.300'}>
                    Questions
                </Text>
                <VStack spacing={4} align="stretch">
                    {contest.questions?.map((question) => (
                        <Box key={question.id} p={4} bg={colorMode === 'light' ? 'white' : 'gray.700'} borderRadius="md" shadow="sm" _hover={{ bg: colorMode === 'light' ? 'teal.50' : 'teal.900' }}>
                            <Text fontSize="md" color={colorMode === 'light' ? 'blue.600' : 'blue.300'} fontWeight="medium">
                                {question.title}
                            </Text>
                        </Box>
                    ))}
                </VStack>
            </Box>

            <Divider borderColor={colorMode === 'light' ? 'gray.300' : 'gray.600'} />

            {/* Enrolled Students */}
            <Box my={6}>
                <Text fontSize="lg" fontWeight="semibold" mb={4} color={colorMode === 'light' ? 'teal.600' : 'teal.300'}>
                    Enrolled Students
                </Text>
                <VStack spacing={4} align="stretch">
                    {contest.enrolledStudents?.map((student) => (
                        <HStack
                            key={student.id}
                            p={4}
                            bg={colorMode === 'light' ? 'white' : 'gray.700'}
                            borderRadius="md"
                            shadow="sm"
                            _hover={{ bg: colorMode === 'light' ? 'gray.100' : 'gray.600' }}
                            justifyContent="space-between"
                        >
                            <HStack spacing={3}>
                                <Avatar name={student.name} size="sm" />
                                <Text fontSize="md" color={colorMode === 'light' ? 'gray.700' : 'gray.300'} fontWeight="medium">
                                    {student.name}
                                </Text>
                                <Tag size="sm" colorScheme="blue">
                                    {student.email}
                                </Tag>
                            </HStack>
                            <Button size="sm" colorScheme="teal" variant="outline">
                                View Profile
                            </Button>
                        </HStack>
                    ))}
                </VStack>
            </Box>
        </Box>
    );
};

export default ContestDetails;
