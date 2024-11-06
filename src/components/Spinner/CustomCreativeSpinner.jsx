import React from "react";
import { Box, Text, Spinner, HStack, VStack, Icon } from "@chakra-ui/react";
import {
  FaCode,
  FaBrain,
  FaRocket,
  FaMountain,
  FaLightbulb,
} from "react-icons/fa";
import { keyframes } from "@emotion/react";
const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const bounceAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const CustomCreativeSpinner = () => {
  return (
    <VStack spacing={12} p={8} justify="center" align="center" h="100vh">
      <HStack spacing={8}>
        <Icon
          as={FaCode}
          boxSize={12}
          color="teal.400"
          animation={`${spinAnimation} 2s linear infinite`}
        />
        <Icon
          as={FaMountain}
          boxSize={12}
          color="green.400"
          animation={`${bounceAnimation} 3s ease-in-out infinite`}
        />
        <Spinner
          thickness="6px"
          speed="1s"
          emptyColor="gray.300"
          color="purple.600"
          size="xl"
        />
        <Icon
          as={FaBrain}
          boxSize={12}
          color="yellow.500"
          animation={`${spinAnimation} 2.5s linear infinite`}
        />
      </HStack>
      <HStack spacing={6}>
        <Icon
          as={FaRocket}
          boxSize={14}
          color="red.500"
          animation={`${spinAnimation} 4s linear infinite`}
        />
        <Text
          fontSize="2xl"
          fontWeight="extrabold"
          color="purple.700"
          textAlign="center"
        >
          Gearing up for an epic coding journey...
        </Text>
        <Icon
          as={FaLightbulb}
          boxSize={14}
          color="yellow.300"
          animation={`${bounceAnimation} 2s ease-in-out infinite`}
        />
      </HStack>
      <Text
        fontSize="lg"
        fontWeight="medium"
        color="gray.600"
        textAlign="center"
      >
        Sit tight! Your adventure into solving problems and conquering
        challenges is almost ready!
      </Text>
    </VStack>
  );
};

export default CustomCreativeSpinner;
