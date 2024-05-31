import React from "react";
import { Link } from "react-router-dom";
import { Box, Text, List, ListItem, Flex } from "@chakra-ui/react";

const Problems = () => {
  const questions = [
    { title: "Print Number", difficulty: "Low" },
    { title: "Print string variable", difficulty: "Low" },
    { title: "Printing Two Variables on Separate Lines", difficulty: "Low" },
    { title: "Calculate", difficulty: "Low" },
    { title: "Multiply by 50", difficulty: "Low" },
    { title: "Square and Sum", difficulty: "Low" },
    { title: "Arithmetic Operations on Two Numbers", difficulty: "Low" },
    { title: "Find your friend", difficulty: "Low" },
  ];

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>Problems</Text>
      <List spacing={4}>
        {questions.map((question, index) => (
          <ListItem
            key={index}
            borderRadius="md"
            backgroundColor="rgba(0, 0, 0, 0.03)"
          >
            <Link to={`/problem/${index + 1}`} style={{ textDecoration: "none", display: "block" }}>
              <Flex
                p={4}
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Text>{question.title}</Text>
                  <Text mt={2} color="gray.500">{question.difficulty}</Text>
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
