import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Text, List, ListItem, Flex } from "@chakra-ui/react";
import { fetchQuestions } from "../redux/apiSlice";
import { useDispatch, useSelector } from "react-redux";

const Problems = () => {
  let dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchQuestions());
  }, []);
  let {data}=useSelector(store=>store)
  console.log('data: ', data);

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>
        Problems
      </Text>
      <List spacing={4}>
        {data.questions.map((question, index) => (
          <ListItem
            key={index}
            borderRadius="md"
            backgroundColor="rgba(0, 0, 0, 0.03)"
          >
            <Link
              to={`/problem/${question.id}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <Flex p={4} alignItems="center" justifyContent="space-between">
                <Box>
                  <Text>{question.title}</Text>
                  <Text mt={2} color="gray.500">
                    {question.difficulty}
                  </Text>
                </Box>
              </Flex>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Problems;
