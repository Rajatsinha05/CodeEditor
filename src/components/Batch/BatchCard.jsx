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
  Box,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Skeleton,
  SkeletonText,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FiMoreVertical,
  FiTrash2,
  FiEye,
  FiEdit,
  FiCalendar,
  FiUsers,
  FiBriefcase,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import BatchEditModal from "./BatchEditModal";
import Ability from "../../Permissions/Ability";
import { GetRoles } from "../../Permissions/Roles";
import { useDispatch } from "react-redux";
import { deleteBatch } from "../../redux/Batch/batchSlice";
import CreateBatchForm from "../../Pages/CreateBatch";
import {
  MdTimer,
  MdAssignment,
  MdAdd,
  MdEventAvailable,
  MdEdit,
  MdDelete,
} from "react-icons/md";

const BatchCard = ({ batch, isLoading }) => {
  const navigate = useNavigate();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  const borderColor = useColorModeValue("red.200", "teal.100");
  const hoverBorderColor = useColorModeValue("red.300", "teal.200");
  const cardBgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (isLoading) {
    return (
      <Flex
        direction="column"
        p={6}
        rounded="lg"
        shadow="md"
        bg={cardBgColor}
        border="1px solid"
        borderColor={borderColor}
        position="relative"
      >
        <Skeleton height="20px" mb={4} width="60%" />
        <Divider mb={4} />
        <SkeletonText mt={4} noOfLines={3} spacing="4" />
        <Skeleton height="20px" mt={4} width="40%" />
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      p={6}
      rounded="lg"
      shadow="md"
      bg={cardBgColor}
      border="1px solid"
      borderColor={borderColor}
      _hover={
        !isMenuOpen
          ? {
              borderColor: hoverBorderColor,
              transform: "scale(1.03)",
              transition:
                "transform 0.3s ease-in-out, border-color 0.2s ease-in-out",
            }
          : {}
      }
      position="relative"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Flex align="center">
          <FiBriefcase size="20px" style={{ marginRight: "8px" }} />
          <Heading size="md" color={textColor} isTruncated>
            {batch.name}
          </Heading>
        </Flex>

        <Menu
          onOpen={() => setMenuOpen(true)}
          onClose={() => setMenuOpen(false)}
        >
          <MenuButton
            as={IconButton}
            icon={<FiMoreVertical />}
            variant="ghost"
          />
          <MenuList>
            <MenuItem
              icon={<FiEye />}
              onClick={() => navigate(`/batch/${batch.id}`)}
            >
              View Details
            </MenuItem>

            <Ability roles={GetRoles()}>
              <MenuItem
                icon={<FiUsers />}
                onClick={() =>
                  navigate(`/admin/batch/assign-students/${batch.id}`)
                }
              >
                Assign Students
              </MenuItem>
              <MenuItem
                icon={<MdAdd />}
                onClick={() =>
                  navigate(`/admin/batch/${batch.id}/create-contest`)
                }
              >
                Assign Contest
              </MenuItem>
              <MenuItem
                icon={<MdAssignment />}
                onClick={() =>
                  navigate(
                    `/admin/batch/${batch.id}/assign-project?module=${batch.module}`
                  )
                }
              >
                Assign Project
              </MenuItem>
              <MenuItem icon={<FiEdit />} onClick={openEditModal}>
                Edit Batch
              </MenuItem>

              <MenuItem
                icon={<FiTrash2 />}
                color="red.500"
                onClick={() => dispatch(deleteBatch(batch.id))}
              >
                Delete Batch
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
            Created On: {dayjs(batch.createdAt).format("MMMM D, YYYY")}
          </Text>
        </Flex>
        <Badge
          px={3}
          py={1}
          fontSize="sm"
          rounded="full"
          colorScheme={textColor}
          display="flex"
          alignItems="center"
          gap={2}
        >
          <FiUsers size="14px" />
          {batch.branchCode}
        </Badge>
      </Flex>

      <BatchEditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        batch={batch}
      />
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <CreateBatchForm
              isOpen={isOpen}
              onClose={onClose}
              initialData={batch}
              isEditing={true}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default BatchCard;
