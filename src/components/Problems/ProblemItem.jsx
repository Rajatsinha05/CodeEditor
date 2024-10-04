import React from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Text, ListItem } from "@chakra-ui/react";

const ProblemItem = ({ question }) => {
  return (
    <ListItem borderRadius="md" backgroundColor="rgba(0, 0, 0, 0.03)">
      <Link to={`/problem/${question.id}`} style={{ textDecoration: "none", display: "block" }}>
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
  );
};

export default ProblemItem;
