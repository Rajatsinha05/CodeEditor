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
import AddProject from "../../Pages/AddProject";
import Ability from "../../Permissions/Ability";

const AssignProjectCard = ({
  test,
  onAssignClick,
  moduleIcons,
  borderColor,
  hoverBorderColor,
  textColor,
  isLoading,
}) => {
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  if (isLoading) {
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

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setEditModalOpen(true);
  };

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
        mt={
          5
        }
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
              <MenuItem icon={<FiEye />} onClick={() => setViewModalOpen(true)}>
                View Details
              </MenuItem>
              <MenuItem
                icon={<MdAssignment />}
                onClick={() => onAssignClick(test.id)}
              >
                Assign Project
              </MenuItem>
              <Ability roles={["SUPERADMIN"]}>
                <MenuItem
                  icon={<FiEdit />}
                  onClick={() => handleEditClick(test)}
                >
                  Edit Project
                </MenuItem>
                <MenuItem icon={<FiTrash2 />} color="red.500">
                  Delete Project
                </MenuItem>
              </Ability>
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

      {/* View Details Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)}>
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
            <Button onClick={() => setViewModalOpen(false)} colorScheme="teal">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Project Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent maxWidth="800px">
          <ModalHeader fontWeight="bold">Edit Project</ModalHeader>
          <ModalBody>
            <AddProject project={selectedProject} />
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => setEditModalOpen(false)}
              colorScheme="teal"
              mr={3}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AssignProjectCard;
