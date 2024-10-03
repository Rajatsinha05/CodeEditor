import { Box } from "@chakra-ui/react";
import React from "react";
import CodeEditor from "../components/CodeEditor";
import { useParams } from "react-router-dom";

const SingleProblem = () => {
  const { questionId } = useParams();
  

  return (
    <Box minH="100vh" bg="#0f0a19" color="gray.500" px={6} py={8}>
      <CodeEditor problemId={questionId} />
    </Box>
  );
};

export default SingleProblem;
