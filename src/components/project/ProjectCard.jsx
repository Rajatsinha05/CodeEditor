import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  IconButton,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Badge,
  Skeleton,
  SkeletonText,
  Tooltip,
  HStack,
  Flex,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import {
  FiMoreVertical,
  FiEye,
  FiEdit,
  FiTrash2,
  FiClock,
  FiPlayCircle,
  FiPauseCircle,
  FiXCircle,
} from "react-icons/fi";
import { FaReact, FaNodeJs, FaJs } from "react-icons/fa";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate, useParams } from "react-router-dom";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const ProjectCard = ({
  test,
  onDeleteClick,
  borderColor = "gray.300",
  hoverBorderColor = "teal.500",
  textColor = "gray.800",
  isLoading = false,
}) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [status, setStatus] = useState("");
  const [isViewModalOpen, setViewModalOpen] = useState(false);

  const moduleIcons = {
    REACT: <FaReact color="#61DBFB" size="24px" />,
    NODE: <FaNodeJs color="#3C873A" size="24px" />,
    JAVASCRIPT: <FaJs color="#F7DF1E" size="24px" />,
  };

  const statusIcons = {
    Upcoming: <FiPlayCircle color="blue" size="24px" />,
    Running: <FiPauseCircle color="green" size="24px" />,
    Ended: <FiXCircle color="red" size="24px" />,
  };

  const calculateTimeLeft = () => {
    const now = dayjs();
    if (dayjs(test.startTime).isAfter(now)) {
      setStatus("Upcoming");
      setTimeLeft(dayjs(test.startTime).fromNow());
    } else if (dayjs(test.endTime).isAfter(now)) {
      setStatus("Running");
      setTimeLeft(dayjs(test.endTime).to(now, true));
    } else {
      setStatus("Ended");
      setTimeLeft("");
    }
  };

  useEffect(() => {
    if (!isLoading) {
      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timer);
    }
  }, [test.startTime, test.endTime, isLoading]);

  const { batchId } = useParams();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box
        p={6}
        rounded="lg"
        shadow="md"
        bg={useColorModeValue("gray.50", "gray.800")}
        border="1px solid"
        borderColor={borderColor}
      >
        <Skeleton height="20px" mb={4} width="60%" />
        <SkeletonText mt={4} noOfLines={4} spacing="4" />
        <Skeleton height="20px" mt={4} width="40%" />
      </Box>
    );
  }

  return (
    <Box
      p={6}
      rounded="xl"
      shadow="lg"
      bg={useColorModeValue("white", "gray.800")}
      border="1px solid"
      borderColor={borderColor}
      transition="all 0.3s ease-in-out"
      _hover={{
        borderColor: hoverBorderColor,
        transform: "scale(1.05)",
        boxShadow: "xl",
      }}
    >
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <HStack spacing={3}>
            {moduleIcons[test.module] || <FiClock size="24px" />}
            <Heading size="md" color={textColor} isTruncated>
              {test.title}
            </Heading>
          </HStack>

          <Menu>
            <Tooltip label="More Actions">
              <MenuButton as={IconButton} icon={<FiMoreVertical />} />
            </Tooltip>
            <MenuList>
              <MenuItem
                icon={<FiEye />}
                onClick={() => navigate(`/batch/${batchId}/project/${test.id}`)}
              >
                View Details
              </MenuItem>
              <MenuItem icon={<FiEdit />} onClick={() => setViewModalOpen(true)}>
                Edit Test
              </MenuItem>
              <MenuItem
                icon={<FiTrash2 />}
                color="red.500"
                onClick={() => onDeleteClick(test.id)}
              >
                Delete Test
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        <Divider />

        <Flex justify="space-between">
          <Text fontSize="sm" color={textColor}>
            Start: {dayjs(test.startTime).format("MMMM D, YYYY h:mm A")}
          </Text>
          <Text fontSize="sm" color={textColor}>
            End: {dayjs(test.endTime).format("MMMM D, YYYY h:mm A")}
          </Text>
        </Flex>

        <HStack justify="space-between">
          <Badge
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={2}
            borderRadius="lg"
            colorScheme={status === "Running" ? "green" : status === "Upcoming" ? "blue" : "red"}
          >
            {statusIcons[status]} {status}
          </Badge>

          <Text fontSize="sm">
            {status === "Running" && `Ends in: ${timeLeft}`}
            {status === "Upcoming" && `Starts in: ${timeLeft}`}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ProjectCard;
