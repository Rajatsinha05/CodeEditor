import React, { useEffect, useState, useCallback } from "react";
import { Flex, Text, HStack } from "@chakra-ui/react";
import { MdTimer } from "react-icons/md";

const ContestHeader = ({ contest, colorMode }) => {
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

    const newRemainingTime = `${
      days > 0 ? `${days}d ` : ""
    }${hours > 0 ? `${hours}h ` : ""}${minutes}m ${seconds}s`;

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

  return (
    <Flex justify="space-between" align="center" mb={6}>
      <Text
        fontSize="3xl"
        fontWeight="bold"
        color={colorMode === "light" ? "teal.600" : "teal.300"}
      >
        {contest?.title}
      </Text>
      <HStack>
        <MdTimer color={colorMode === "light" ? "red.600" : "red.300"} />
        <Text fontSize="lg" color={colorMode === "light" ? "red.600" : "red.300"}>
          {remainingTime}
        </Text>
      </HStack>
    </Flex>
  );
};

export default ContestHeader;
