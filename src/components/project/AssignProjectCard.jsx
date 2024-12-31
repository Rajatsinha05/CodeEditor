import React, { useState } from "react";
import {
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Badge,
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
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import {
  FiMoreVertical,
  FiEye,
  FiEdit,
  FiTrash2,
  FiCalendar,
} from "react-icons/fi";
import { MdAssignment } from "react-icons/md";
import dayjs from "dayjs";

const AssignProjectCard = ({
  test,
  onAssignClick,
  moduleIcons,
  borderColor,
  hoverBorderColor,
  textColor,
  isLoading,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    // Render skeleton loader while data is loading
    return (
      <Flex
        direction="column"
        p={6}
        rounded="lg"
        shadow="md"
        bg={useColorModeValue("gray.50", "gray.800")}
        border="1px solid"
        borderColor={borderColor}
      >
        <Skeleton height="20px" mb={4} width="60%" />
        <Divider mb={4} />
        <SkeletonText mt={4} noOfLines={3} spacing="4" />
        <Skeleton height="20px" mt={4} width="40%" />
      </Flex>
    );
  }

  return (
    <>
      <Flex
        direction="column"
        p={6}
        rounded="lg"
        shadow="md"
        bg={useColorModeValue("gray.50", "gray.800")}
        border="1px solid"
        borderColor={borderColor}
        _hover={{
          borderColor: hoverBorderColor,
          transform: "scale(1.03)",
          transition:
            "transform 0.3s ease-in-out, border-color 0.2s ease-in-out",
        }}
        position="relative"
      >
        <Flex justify="space-between" align="center" mb={4}>
          <Flex align="center">
            {moduleIcons[test.module] || <FiCalendar />}
            <Heading size="md" color={textColor} ml={2} isTruncated>
              {test.title}
            </Heading>
          </Flex>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FiMoreVertical />}
              variant="ghost"
            />
            <MenuList>
              <MenuItem icon={<FiEye />} onClick={() => setModalOpen(true)}>
                View Details
              </MenuItem>
              <MenuItem
                icon={<MdAssignment />}
                onClick={() => onAssignClick(test.id)}
              >
                Assign Project
              </MenuItem>
              <MenuItem icon={<FiEdit />}>Edit Project</MenuItem>
              <MenuItem icon={<FiTrash2 />} color="red.500">
                Delete Project
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        <Divider mb={4} />
        <Flex justify="space-between" align="center">
          <Flex align="center">
            <FiCalendar size="16px" style={{ marginRight: "4px" }} />
            <Text fontSize="sm" color={textColor}>
              Created On: {dayjs(test.createdAt).format("MMMM D, YYYY")}
            </Text>
          </Flex>
          <Badge
            px={3}
            py={1}
            fontSize="sm"
            rounded="full"
            colorScheme="teal"
            display="flex"
            alignItems="center"
            gap={2}
          >
            Difficulty: {test.difficultyLevel}
          </Badge>
        </Flex>
      </Flex>

      {/* Modal for rendering test.description */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontWeight="bold">{test.title}</ModalHeader>
          <ModalBody>
            <div
              dangerouslySetInnerHTML={{ __html: test.description }}
              style={{ color: textColor }}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setModalOpen(false)} colorScheme="teal">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AssignProjectCard;
