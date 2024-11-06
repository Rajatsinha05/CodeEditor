import { Box } from "@chakra-ui/react";
import React from "react";

import { useParams } from "react-router-dom";
import CodeEditor from "../components/Editor/CodeEditor";

const SingleProblem = () => {
  const { questionId } = useParams();
  

  return (
    <Box minH="100vh" bg="#0f0a19" color="gray.500" px={6} py={8}>
      <CodeEditor problemId={questionId} />
    </Box>
  );
};

export default SingleProblem;
