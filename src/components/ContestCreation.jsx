import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  useToast,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

const ContestCreation = ({ addContest }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [contestName, setContestName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const toast = useToast();

  const createContest = () => {
    if (!contestName || !startTime || !endTime) {
      toast({
        title: 'Missing information',
        description: 'Please fill out all fields to create a contest.',
        status: 'error',
        duration: 6000,
      });
      return;
    }

    const newContest = {
      name: contestName,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
    };
    addContest(newContest);
    toast({
      title: 'Contest created',
      description: `Contest "${contestName}" created successfully.`,
      status: 'success',
      duration: 6000,
    });
    onClose();
  };

  return (
    <>
      <Button mt={4} variant="outline" colorScheme="blue" onClick={onOpen}>
        Create Contest
      </Button>
      <Drawer placement="right" onClose={onClose} isOpen={isOpen} size="md">
        <DrawerOverlay />
        <DrawerContent bg="gray.900" color="gray.100">
          <DrawerCloseButton />
          <DrawerHeader bg="teal.500" color="white">
            Create Contest
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Contest Name</FormLabel>
                <Input
                  placeholder="Enter contest name"
                  value={contestName}
                  onChange={(e) => setContestName(e.target.value)}
                  bg="gray.700"
                  color="gray.100"
                  borderColor="gray.600"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Start Time</FormLabel>
                <Input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  bg="gray.700"
                  color="gray.100"
                  borderColor="gray.600"
                />
              </FormControl>
              <FormControl>
                <FormLabel>End Time</FormLabel>
                <Input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  bg="gray.700"
                  color="gray.100"
                  borderColor="gray.600"
                />
              </FormControl>
              <Button colorScheme="teal" onClick={createContest}>
                Create Contest
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ContestCreation;
