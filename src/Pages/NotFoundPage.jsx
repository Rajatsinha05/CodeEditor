import React from "react";
import { Box, Flex, Text, Button, VStack, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionBox = motion(Box);

const NotFoundPage = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "white");
  const buttonBg = useColorModeValue("green.500", "green.400");
  const buttonHoverBg = useColorModeValue("green.600", "green.500");

  return (
    <Flex
      bg={bgColor}
      color={textColor}
      height="100vh"
      justify="center"
      align="center"
      direction="column"
      px={4}
      textAlign="center"
    >
      {/* 404 Text */}
      <Text fontSize={{ base: "6xl", md: "8xl" }} fontWeight="bold" mb={4}>
        404
      </Text>

      {/* Animated Character */}
      
      

      {/* Message */}
      <Text fontSize={{ base: "xl", md: "2xl" }} mb={2}>
        Looks like you're lost
      </Text>
      <Text fontSize={{ base: "sm", md: "md" }} color="gray.500" mb={6}>
        The page you are looking for is not available!
      </Text>

      {/* Button */}
      <VStack>
        <Button
          as={Link}
          to="/"
          bg={buttonBg}
          color="white"
          _hover={{ bg: buttonHoverBg }}
          size="lg"
          shadow="md"
          transition="all 0.3s ease-in-out"
        >
          Go to Home
        </Button>
      </VStack>
    </Flex>
  );
};

export default NotFoundPage;
