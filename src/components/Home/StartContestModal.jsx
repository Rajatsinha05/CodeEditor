import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Divider,
  Avatar,
  Flex,
  Icon,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { CalendarIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { FaFlagCheckered } from "react-icons/fa";
import { MdEventAvailable, MdRule } from "react-icons/md";
import dayjs from "dayjs";

const StartContestModal = ({ isOpen, onClose, contest, onProceed }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex alignItems="center">
            <Avatar size="sm" mr={3} />
            Contest Details and Rules
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            {contest.title}
          </Text>
          <Text fontSize="md">{contest.description}</Text>
          <Divider my={4} />
          <HStack mb={4}>
            <Icon as={InfoOutlineIcon} w={5} h={5} color="blue.500" />
            <Text fontSize="md" fontWeight="semibold">
              General Information:
            </Text>
          </HStack>
          <VStack align="start" spacing={2}>
            <Text fontSize="sm">
              <Icon as={CalendarIcon} mr={2} color="teal.500" /> Start Time: {dayjs(contest.startTime).format("YYYY-MM-DD hh:mm A")}
            </Text>
            <Text fontSize="sm">
              <Icon as={FaFlagCheckered} mr={2} color="red.500" /> End Time: {dayjs(contest.endTime).format("YYYY-MM-DD hh:mm A")}
            </Text>
            <Text fontSize="sm">
              <Icon as={MdEventAvailable} mr={2} color="cyan.500" /> Participation: Open to all registered students
            </Text>
          </VStack>
          <Divider my={4} />
          <HStack mb={2}>
            <Icon as={MdRule} w={5} h={5} color="orange.500" />
            <Text fontSize="md" fontWeight="semibold">
              Contest Rules:
            </Text>
          </HStack>
          <VStack align="start" spacing={2} pl={6}>
            <Text fontSize="sm">1. Be respectful to other participants.</Text>
            <Text fontSize="sm">2. Do not engage in any form of cheating.</Text>
            <Text fontSize="sm">3. Complete the contest within the given time frame.</Text>
            <Text fontSize="sm">4. Do not close the browser during the contest.</Text>
          </VStack>
          <Divider my={4} />
          <Text fontSize="md" fontWeight="bold" color="teal.500" mt={4}>
            Good Luck!
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={onProceed}>
            Proceed
          </Button>
          <Button variant="ghost" onClick={onClose} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StartContestModal;
