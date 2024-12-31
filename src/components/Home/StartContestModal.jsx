import React, { useState } from "react";
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
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { CalendarIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { FaFlagCheckered } from "react-icons/fa";
import { MdEventAvailable, MdRule } from "react-icons/md";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { startContestAttempt } from "../../redux/contestAttemptSlice";
import { useNavigate } from "react-router-dom";

const StartContestModal = ({ isOpen, onClose, contest, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNavigated, setIsNavigated] = useState(false); // Prevent multiple navigations

  const handleProceed = async () => {
    if (isNavigated) return; // Prevent further actions if already navigating
    setLoading(true);
    setError(null);
    dispatch(
      startContestAttempt({ contestId: contest.id, studentId: user.id })
    );
    navigate(`/contest/${contest.id}`);
    // try {
    //   const resultAction = await dispatch(
    //     startContestAttempt({ contestId: contest.id, studentId: user.id })
    //   ).unwrap();

    //   setIsNavigated(true); // Mark as navigated
    //   onClose(); // Close modal
    //   navigate(`/contest/${contest.id}`); // Navigate to contest details
    // } catch (err) {
    //   setError(err.message || "An unexpected error occurred.");
    // } finally {
    //   setLoading(false);
    // }
  };

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
              <Icon as={CalendarIcon} mr={2} color="teal.500" /> Start Time:{" "}
              {dayjs(contest.startTime).format("YYYY-MM-DD hh:mm A")}
            </Text>
            <Text fontSize="sm">
              <Icon as={FaFlagCheckered} mr={2} color="red.500" /> End Time:{" "}
              {dayjs(contest.endTime).format("YYYY-MM-DD hh:mm A")}
            </Text>
            <Text fontSize="sm">
              <Icon as={MdEventAvailable} mr={2} color="cyan.500" />{" "}
              Participation: Open to all registered students
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
            <Text fontSize="sm">
              3. Complete the contest within the given time frame.
            </Text>
            <Text fontSize="sm">
              4. Do not close the browser during the contest.
            </Text>
          </VStack>
          <Divider my={4} />
          <Text fontSize="md" fontWeight="bold" color="teal.500" mt={4}>
            Good Luck!
          </Text>
          {error && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            onClick={handleProceed}
            isDisabled={loading || isNavigated}
          >
            {loading ? <Spinner size="sm" /> : "Proceed"}
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            ml={3}
            isDisabled={loading || isNavigated}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(StartContestModal);
