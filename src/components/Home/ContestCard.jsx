import React from "react";
import {
  Box,
  Text,
  HStack,
  Stack,
  Divider,
  Button,
  Tooltip,
  Icon,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import { FaFlagCheckered } from "react-icons/fa";
import { MdPlayArrow, MdEdit, MdDelete } from "react-icons/md";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { deleteContest } from "../../redux/contestSlice";
import CreateContest from "../../Pages/CreateContest";

const ContestCard = ({ contest, user, onStartClick }) => {
  console.log('user: ', user);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const currentTime = dayjs();
  const contestActive =
    currentTime.isAfter(dayjs(contest.startTime)) &&
    currentTime.isBefore(dayjs(contest.endTime));
  const contestUpcoming = currentTime.isBefore(dayjs(contest.startTime));
  const contestPast = currentTime.isAfter(dayjs(contest.endTime));

  const titleColor = contestActive
    ? "teal.500"
    : contestUpcoming
    ? "yellow.500"
    : "red.500";
  const cardBgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.100");
  const dividerColor = useColorModeValue("gray.200", "gray.600");

  const isEditableOrDeletable =
    user?.role === "SUPERADMIN" || contest.createdBy === user?.id;
  console.log("isEditableOrDeletable", isEditableOrDeletable);

  const handleDelete = () => {
    dispatch(deleteContest(contest.id));
  };

  return (
    <Box
      borderWidth="1px"
      borderColor={dividerColor}
      borderRadius="md"
      p={6}
      bg={cardBgColor}
      shadow="md"
      _hover={{
        transform: "scale(1.02)",
        transition: "0.3s",
        cursor: "pointer",
      }}
    >
      <Text fontSize="xl" fontWeight="bold" color={titleColor}>
        {contest.title}
      </Text>
      <Text fontSize="md" color={textColor} mt={2}>
        {contest.description}
      </Text>
      <Stack mt={3} spacing={4}>
        <HStack>
          <Icon as={CalendarIcon} color="teal.500" />
          <Text fontSize="sm" color={textColor}>
            Starts: {dayjs(contest.startTime).format("YYYY-MM-DD hh:mm A")}
          </Text>
        </HStack>
        <HStack>
          <Icon as={FaFlagCheckered} color="red.500" />
          <Text fontSize="sm" color={textColor}>
            Ends: {dayjs(contest.endTime).format("YYYY-MM-DD hh:mm A")}
          </Text>
        </HStack>
      </Stack>
      <Divider my={4} borderColor={dividerColor} />

      {contestActive && (
        <Tooltip label="Start Contest" aria-label="Start Contest">
          <Button
            mt={4}
            colorScheme="teal"
            onClick={() => onStartClick(contest)}
            leftIcon={<MdPlayArrow />}
          >
            Start Contest
          </Button>
        </Tooltip>
      )}
      {contestUpcoming && (
        <Box mt={4} color="yellow.500" fontWeight="bold">
          <Text>Contest starts soon!</Text>
        </Box>
      )}
      {contestPast && (
        <Text mt={4} color="red.500" fontWeight="bold">
          Contest has ended
        </Text>
      )}

      {isEditableOrDeletable && (
        <HStack mt={4} spacing={3}>
          <Tooltip label="Edit Contest" aria-label="Edit Contest">
            <Button
              leftIcon={<MdEdit />}
              colorScheme="blue"
              onClick={() => onOpen}
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip label="Delete Contest" aria-label="Delete Contest">
            <Button
              leftIcon={<MdDelete />}
              colorScheme="red"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Tooltip>
        </HStack>
      )}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Contest</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateContest
              initialData={contest}
              onClose={onClose}
              isEditing={true}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ContestCard;
