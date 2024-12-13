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
} from "@chakra-ui/react";
import { FiMoreVertical, FiTrash2, FiEye, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import BatchEditModal from "./BatchEditModal";
import Ability from "../../Permissions/Ability";
import { GetRoles } from "../../Permissions/Roles";

const BatchCard = ({ batch }) => {
  const navigate = useNavigate();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  const borderColor = useColorModeValue("red.200", "teal.100");
  const hoverBorderColor = useColorModeValue("red.300", "teal.200");
  const cardBgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");

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
        <Heading size="md" color={textColor} isTruncated>
          {batch.name}
        </Heading>

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
              <MenuItem icon={<FiEdit />} onClick={openEditModal}>
                Edit Batch
              </MenuItem>
              <MenuItem icon={<FiTrash2 />} color="red.500">
                Delete Batch
              </MenuItem>
            </Ability>
          </MenuList>
        </Menu>
      </Flex>

      <Divider mb={4} />

      <Flex justify="space-between">
        <Box>
          <Text fontSize="sm" color={textColor}>
            Created On: {dayjs(batch.createdAt).format("MMMM D, YYYY")}
          </Text>
        </Box>
        <Badge
          px={3}
          py={1}
          fontSize="sm"
          rounded="full"
          colorScheme={textColor}
        >
          {batch.branchCode}
        </Badge>
      </Flex>

      <BatchEditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        batch={batch}
      />
    </Flex>
  );
};

export default BatchCard;
