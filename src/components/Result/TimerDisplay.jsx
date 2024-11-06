import React, { useEffect, useState } from 'react';
import { HStack, Text } from '@chakra-ui/react';
import { MdTimer } from 'react-icons/md';

const TimerDisplay = ({ endTime }) => {
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    if (endTime) {
      const calculateRemainingTime = () => {
        const endTimeInMs = new Date(endTime).getTime();
        const currentTime = new Date().getTime();
        const difference = endTimeInMs - currentTime;

        if (difference <= 0) {
          setRemainingTime('Contest Ended');
          return;
        }

        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setRemainingTime(
          `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`
        );
      };

      const interval = setInterval(calculateRemainingTime, 1000);
      return () => clearInterval(interval);
    }
  }, [endTime]);

  return (
    <HStack spacing={2}>
      <MdTimer color="teal" />
      <Text>{remainingTime}</Text>
    </HStack>
  );
};

export default TimerDisplay;
