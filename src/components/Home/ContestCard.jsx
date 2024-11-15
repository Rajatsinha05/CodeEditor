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
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import {
  FaFlagCheckered,
  FaEdit,
  FaTrashAlt,
  FaBookmark,
  FaShare,
  FaEye,
} from "react-icons/fa";
import { MdPlayArrow } from "react-icons/md";
import { FiMoreVertical } from "react-icons/fi";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { deleteContestById } from "../../redux/contestSlice";
import { showToast } from "../../utils/toastUtils"; // Import custom toast function

const ContestCard = ({ contest, onStartClick }) => {
  const currentTime = dayjs();
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.user); // Assuming role is in user state

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

  // Handle Delete
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
      <Text fontSize="md" color={textColor} mt={2}>
        {contest.description}
      </Text>

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

      {/* Start Button or Status Message */}
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
              <MenuItem
                icon={<FaEdit />}
                onClick={() => console.log("Edit Contest")}
              >
                Edit
              </MenuItem>
              <MenuItem icon={<FaTrashAlt />} onClick={handleDelete}>
                Delete
              </MenuItem>
            </>
          )}
          <MenuItem
            icon={<FaBookmark />}
            onClick={() => console.log("Bookmark Contest")}
          >
            Bookmark
          </MenuItem>
         
        </MenuList>
      </Menu>
    </Box>
  );
};

export default ContestCard;
