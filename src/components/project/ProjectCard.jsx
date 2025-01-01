import React, { useState } from "react";
import {
  Flex,
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
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import {
  FiMoreVertical,
  FiEye,
  FiEdit,
  FiTrash2,
  FiClock,
} from "react-icons/fi";
import { MdAssignment } from "react-icons/md";
import { FaReact, FaNodeJs, FaJs } from "react-icons/fa";
import dayjs from "dayjs";
import Ability from "../../Permissions/Ability";
import { GetRoles } from "../../Permissions/Roles";
import { useNavigate, useParams } from "react-router-dom";

const ProjectCard = ({
  test,
  onAssignClick,
  onDeleteClick,
  borderColor,
  hoverBorderColor,
  textColor,
  isLoading,
}) => {
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const moduleIcons = {
    REACT: <FaReact color="#61DBFB" />,
    NODE: <FaNodeJs color="#3C873A" />,
    JAVASCRIPT: <FaJs color="#F7DF1E" />,
  };

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

  const { batchId } = useParams();
  const navigate = useNavigate();
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
            {moduleIcons[test.module] || <FiClock />}
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
              <MenuItem
                icon={<FiEye />}
                onClick={() => navigate(`/batch/${batchId}/project/${test.id}`)}
              >
                View Details
              </MenuItem>
              <Ability roles={GetRoles()}>
                <MenuItem
                  icon={<FiEdit />}
                  onClick={() => setEditModalOpen(true)}
                >
                  Edit Test
                </MenuItem>
                <MenuItem
                  icon={<FiTrash2 />}
                  color="red.500"
                  onClick={() => onDeleteClick(test.id)}
                >
                  Delete Test
                </MenuItem>
              </Ability>
            </MenuList>
          </Menu>
        </Flex>
        <Divider mb={4} />

        {/* Start and End Dates */}
        <Flex justify="space-between" align="center" mb={4}>
          <Flex align="center">
            <FiClock size="16px" style={{ marginRight: "4px" }} />
            <Text fontSize="sm" color={textColor}>
              Start: {dayjs(test.startTime).format("MMMM D, YYYY h:mm A")}
            </Text>
          </Flex>
          <Flex align="center">
            <FiClock size="16px" style={{ marginRight: "4px" }} />
            <Text fontSize="sm" color={textColor}>
              End: {dayjs(test.endTime).format("MMMM D, YYYY h:mm A")}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {/* View Details Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontWeight="bold">{test.title}</ModalHeader>
          <ModalBody>
            <Text fontWeight="bold" mb={2}>
              Marks: {test.marks}
            </Text>
            <Text>Module: {test.module}</Text>
            <Text>Status: {test.status}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setViewModalOpen(false)} colorScheme="teal">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Test Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontWeight="bold">Edit Test</ModalHeader>
          <ModalBody>
            <Text>Edit functionality coming soon!</Text>
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

export default ProjectCard;
