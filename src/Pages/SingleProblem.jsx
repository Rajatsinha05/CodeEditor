import { Box } from '@chakra-ui/react';
import React from 'react';
import CodeEditor from '../components/CodeEditor';
import { useParams } from 'react-router-dom'; // Import useParams hook

const SingleProblem = () => {
  const { id } = useParams(); // Access route parameters using useParams hook

  return (
    <Box minH="100vh" bg="#0f0a19" color="gray.500" px={6} py={8}>
     
      <CodeEditor problemId={id} />
    </Box>
  );
};

export default SingleProblem;
