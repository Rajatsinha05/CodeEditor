import React from 'react';
import { Box, Text, Spinner, VStack, Icon, useColorModeValue } from "@chakra-ui/react";
import { FaBolt, FaPuzzlePiece, FaBrain } from "react-icons/fa";
import { keyframes } from '@emotion/react'; // Corrected import

const ProblemsLoadSpinner = () => {
  const bounceAnimation = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  `;
  const textColor = useColorModeValue("blue.600", "yellow.300");

  return (
    <Box p={4} textAlign="center" h="100vh">
      <VStack spacing={8} justify="center" align="center" h="100%">
        <Text fontSize="3xl" fontWeight="bold" color={textColor}>
          Preparing Your Coding Adventure...
        </Text>
        <VStack spacing={4}>
          <Icon
            as={FaPuzzlePiece}
            boxSize={12}
            color="purple.400"
            css={{ animation: `${bounceAnimation} 1.5s ease-in-out infinite` }}
          />
          <Spinner
            thickness="6px"
            speed="1s"
            emptyColor="gray.200"
            color="teal.500"
            size="xl"
          />
          <Icon
            as={FaBolt}
            boxSize={12}
            color="orange.400"
            css={{ animation: `${bounceAnimation} 2s ease-in-out infinite` }}
          />
          <Icon
            as={FaBrain}
            boxSize={12}
            color="pink.400"
            css={{ animation: `${bounceAnimation} 2.5s ease-in-out infinite` }}
          />
        </VStack>
        <Text fontSize="lg" color={useColorModeValue("gray.600", "gray.400")}>
          "Great code starts with great patience!"
        </Text>
      </VStack>
    </Box>
  );
};

export default ProblemsLoadSpinner;
