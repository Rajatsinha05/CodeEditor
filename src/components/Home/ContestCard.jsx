import React, { useState } from "react";
import {
  Box,
  Text,
  HStack,
  Stack,
  Divider,
  Button,
  Tooltip,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import {
  FaFlagCheckered,
  FaEdit,
  FaTrashAlt,
  FaBookmark,
  FaEye,
} from "react-icons/fa";

import { MdEdit, MdPlayArrow } from "react-icons/md";
import { FiMoreVertical } from "react-icons/fi";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteContestById } from "../../redux/contestSlice";
import { showToast } from "../../utils/toastUtils";
import CreateContest from "../../Pages/CreateContest";

const ContestCard = ({ contest, onStartClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useSelector((state) => state.user);
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

  const handleDelete = async () => {
    try {
      await dispatch(deleteContestById(contest.id)).unwrap();
      showToast(toast, "Contest deleted successfully.", "success", 3000);
    } catch (error) {
      showToast(
        toast,
        error.message || "Failed to delete contest.",
        "error",
        3000
      );
    }
  };

  const handleRedirectToContest = () => {
    navigate(`/contest/${contest.id}`);
  };
  const handleEdit = (e) => {
    e.preventDefault(); // Prevent page reload
    console.log("Edit clicked");
    navigate(`/admin/update-contest/${contest.id}`);
  };
  const truncateDescription = (description) => {
    // Strip HTML tags and truncate to 2 lines worth of characters
    const strippedText = description.replace(/<\/?[^>]+(>|$)/g, "");
    const maxLength = 150; // Approximate character limit for 2 lines

    if (strippedText.length > maxLength) {
      return `${strippedText.substring(0, maxLength)}...`;
    }

    return strippedText;
  };
  return (
    <Box
      borderWidth="1px"
      borderColor={dividerColor}
      borderRadius="md"
      p={6}
      bg={cardBgColor}
      shadow="md"
      position="relative"
      _hover={{
        transform: "scale(1.02)",
        transition: "0.3s",
        cursor: "pointer",
      }}
    >
      {/* Contest Title and Description */}
      <Text fontSize="xl" fontWeight="bold" color={titleColor}>
        {contest.title}
      </Text>
      {/* <Text fontSize="md" color={textColor} mt={2}>
        {contest.description}
      </Text> */}
      <Box
        mt={2}
        color={textColor}
        overflow="hidden"
        display="-webkit-box"
        style={{
          WebkitLineClamp: 2, // Limit to 2 lines
          WebkitBoxOrient: "vertical", // Set the box orientation to vertical
        }}
        dangerouslySetInnerHTML={{
          __html: contest?.description || "No description provided.",
        }}
      />

      {/* Start and End Times */}
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

      {/* Conditional Buttons */}
      {contestPast ? (
        <Tooltip label="View Contest" aria-label="View Contest">
          <Button
            mt={4}
            colorScheme="blue"
            onClick={handleRedirectToContest}
            leftIcon={<FaEye />}
          >
            View Contest
          </Button>
        </Tooltip>
      ) : contestActive ? (
        <>
          {user?.role === "SUPERADMIN" || user?.role === "ADMIN" ? (
            <Tooltip label="View Contest" aria-label="View Contest">
              <Button
                mt={4}
                colorScheme="teal"
                onClick={handleRedirectToContest}
                leftIcon={<FaEye />}
              >
                View Contest
              </Button>
            </Tooltip>
          ) : (
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
        </>
      ) : (
        <Box mt={4} color="yellow.500" fontWeight="bold">
          <Text>Contest starts soon!</Text>
        </Box>
      )}

      {/* More Options Menu */}
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<FiMoreVertical />}
          size="sm"
          position="absolute"
          top="4px"
          right="4px"
          aria-label="More options"
        />
        <MenuList>
          {/* Conditional Options for SUPERADMIN or ADMIN */}
          {(user?.role === "SUPERADMIN" || user?.role === "ADMIN") && (
            <>
              <MenuItem icon={<MdEdit />} onClick={handleEdit}>
                Edit
              </MenuItem>
              <MenuItem icon={<FaTrashAlt />} onClick={handleDelete}>
                Delete
              </MenuItem>
            </>
          )}
          <MenuItem
            icon={<FaBookmark />}
            onClick={() =>
              showToast(toast, "Bookmark feature coming soon...", "info")
            }
          >
            Bookmark
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default React.memo(ContestCard);
