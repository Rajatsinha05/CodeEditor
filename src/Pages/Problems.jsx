import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Text, List, ListItem, Flex, Spinner } from "@chakra-ui/react";
import { fetchQuestions } from "../redux/apiSlice";
import { useDispatch, useSelector } from "react-redux";

const Problems = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    dispatch(fetchQuestions())
  }, [dispatch]);

  const { data } = useSelector(store => store);
  let {user}=data;
  if (data.loading) {
    return (
      <Box p={4}>
        <Spinner size="xl" />
      </Box>
    );
  }

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
              to={`/problem/${question._id}`}
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
