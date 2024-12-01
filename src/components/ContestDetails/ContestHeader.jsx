import React, { useEffect, useState, useCallback } from "react";
import {
  Flex,
  Text,
  HStack,
  Icon,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdTimer } from "react-icons/md";

const ContestHeader = ({ contest }) => {
  const [remainingTime, setRemainingTime] = useState("");

  // Memoized calculation of remaining time
  const calculateRemainingTime = useCallback(() => {
    if (!contest?.endTime) return;

    const endTime = new Date(contest.endTime).getTime();
    const currentTime = new Date().getTime();
    const difference = endTime - currentTime;

    if (difference <= 0) {
      setRemainingTime("Contest Ended");
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    const newRemainingTime = `${days > 0 ? `${days}d ` : ""}${
      hours > 0 ? `${hours}h ` : ""
    }${minutes}m ${seconds}s`;

    setRemainingTime((prevTime) =>
      prevTime === newRemainingTime ? prevTime : newRemainingTime
    );
  }, [contest?.endTime]);

  useEffect(() => {
    if (contest?.endTime) {
      const interval = setInterval(calculateRemainingTime, 1000);

      return () => clearInterval(interval); // Clear interval on unmount
    }
  }, [contest?.endTime, calculateRemainingTime]);

  // Dynamic styling
  const bg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("teal.600", "teal.300");
  const timerColor = useColorModeValue("red.600", "red.300");

  return (
    <Box
      bg={bg}
      p={4}
      borderRadius="lg"
      shadow="base"
      transition="all 0.3s ease"
      _hover={{ shadow: "md" }}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        textAlign={{ base: "center", md: "left" }}
      >
        <Text
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          color={textColor}
          mb={{ base: 2, md: 0 }}
        >
          {contest?.title || "Contest Title"}
        </Text>
        <HStack spacing={3}>
          <Icon as={MdTimer} boxSize={6} color={timerColor} />
          <Text fontSize={{ base: "md", md: "lg" }} color={timerColor}>
            {remainingTime}
          </Text>
        </HStack>
      </Flex>
    </Box>
  );
};

export default ContestHeader;
