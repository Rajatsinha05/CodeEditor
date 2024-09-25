import { Box } from "@chakra-ui/react";
import React from "react";
import CodeEditor from "../components/CodeEditor";
import { useParams } from "react-router-dom";

const SingleProblem = ({ type }) => {
  const { id } = useParams();
  console.log("id: ", id);

  return (
    <Box minH="100vh" bg="#0f0a19" color="gray.500" px={6} py={8}>
      <CodeEditor problemId={id} type={type} />
    </Box>
  );
};

export default SingleProblem;
