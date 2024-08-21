import React from 'react';
import {
  Box, Heading, Stat, StatLabel, StatNumber, StatGroup, StatHelpText, Progress
} from "@chakra-ui/react";

const StudentStats = ({ student }) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Heading size="lg" mb={4}>Student Performance Dashboard</Heading>
      <StatGroup>
        <Stat p={4} borderWidth="1px" borderRadius="lg">
          <StatLabel>Total Solved Questions</StatLabel>
          <StatNumber>{student.totalSolvedQuestions}</StatNumber>
          <StatHelpText>Includes practice and contest problems</StatHelpText>
        </Stat>
        <Stat p={4} borderWidth="1px" borderRadius="lg">
          <StatLabel>Total Contests</StatLabel>
          <StatNumber>{student.totalContests}</StatNumber>
          <StatHelpText>Participated</StatHelpText>
        </Stat>
        <Stat p={4} borderWidth="1px" borderRadius="lg">
          <StatLabel>Current Rating</StatLabel>
          <StatNumber>{student.rating}</StatNumber>
          <Progress hasStripe value={student.rating} max={2000} />
          <StatHelpText>Maximum: 2000</StatHelpText>
        </Stat>
        <Stat p={4} borderWidth="1px" borderRadius="lg">
          <StatLabel>Attendance</StatLabel>
          <StatNumber>{student.attendancePercentage}%</StatNumber>
          <Progress colorScheme="green" hasStripe value={student.attendancePercentage} />
          <StatHelpText>Based on total classes</StatHelpText>
        </Stat>
        {/* More stats can be dynamically added here */}
      </StatGroup>
    </Box>
  );
};

export default StudentStats;
