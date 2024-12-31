import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";
import { keyframes } from "@emotion/react"; // Correct import for keyframes

// Keyframes for floating animation
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const NotFoundPage = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "white");
  const buttonBg = useColorModeValue("green.500", "green.400");
  const buttonHoverBg = useColorModeValue("green.600", "green.500");
  const iconColor = useColorModeValue("blue.400", "blue.300");

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
      position="relative"
      overflow="hidden"
    >
      {/* Floating Background Shapes */}
      <Box
        position="absolute"
        top="-100px"
        left="-100px"
        width="200px"
        height="200px"
        bg={useColorModeValue("blue.100", "blue.600")}
        borderRadius="50%"
        zIndex="-1"
        animation={`${float} 3s ease-in-out infinite`}
      />
      <Box
        position="absolute"
        bottom="-100px"
        right="-100px"
        width="150px"
        height="150px"
        bg={useColorModeValue("green.100", "green.600")}
        borderRadius="50%"
        zIndex="-1"
        animation={`${float} 3s ease-in-out infinite`}
      />

      {/* 404 Text */}
      <Text fontSize={{ base: "6xl", md: "8xl" }} fontWeight="bold" mb={4}>
        404
      </Text>

      {/* Animated Icon */}
      <motion.div
        animate={{ rotate: [0, 20, -20, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={{ marginBottom: "24px" }}
      >
        <FaMapMarkedAlt size={80} color={iconColor} />
      </motion.div>

      {/* Message */}
      <Text fontSize={{ base: "xl", md: "2xl" }} mb={2}>
        Uh-oh! You seem to be lost.
      </Text>
      <Text fontSize={{ base: "sm", md: "md" }} color="gray.500" mb={6}>
        The page you're looking for doesn't exist. Maybe you took a wrong turn?
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
          shadow="lg"
          transition="all 0.3s ease-in-out"
        >
          Go Back to Safety
        </Button>
      </VStack>
    </Flex>
  );
};

export default NotFoundPage;
