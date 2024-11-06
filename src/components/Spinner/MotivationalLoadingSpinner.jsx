import React from "react";
import {
  Box,
  Text,
  Spinner,
  VStack,
  Icon,

  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { FaBolt, FaRocket, FaMedal, FaSmileBeam } from "react-icons/fa";
import { keyframes } from '@emotion/react';
const bounceAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

const rotateAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const MotivationalLoadingSpinner = () => {
  const textColor = useColorModeValue("purple.600", "yellow.300");
  const iconColor = useColorModeValue("orange.400", "teal.300");

  return (
    <VStack spacing={10} p={10} justify="center" align="center" h="100vh">
      <Box textAlign="center">
        <Text fontSize="3xl" fontWeight="extrabold" color={textColor}>
          The Countdown Begins!
        </Text>
        <Text fontSize="lg" color={textColor} mt={1}>
          Greatness is loading...
        </Text>
      </Box>
      <HStack spacing={8}>
        <Icon
          as={FaBolt}
          boxSize={16}
          color={iconColor}
          animation={`${bounceAnimation} 2s ease-in-out infinite`}
        />
        <Spinner
          thickness="8px"
          speed="0.9s"
          emptyColor="gray.200"
          color="purple.500"
          size="xl"
          animation={`${rotateAnimation} 1.5s linear infinite`}
        />
        <Icon
          as={FaRocket}
          boxSize={16}
          color="red.400"
          animation={`${bounceAnimation} 2.5s ease-in-out infinite`}
        />
      </HStack>
      <VStack spacing={6}>
        <Icon
          as={FaMedal}
          boxSize={20}
          color="yellow.500"
          animation={`${bounceAnimation} 3s ease-in-out infinite`}
        />
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Preparing your journey to victory...
        </Text>
      </VStack>
    </VStack>
  );
};

export default MotivationalLoadingSpinner;
