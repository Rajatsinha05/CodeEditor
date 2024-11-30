import React, { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Button,
  Text,
  Icon,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FaUsers, FaUserGraduate, FaCog, FaPlus } from "react-icons/fa";
import CreateUserModal from "./CreateUserModal";
import CreateStudentModal from "./CreateStudentModal";

const Sidebar = ({ isAdmin, isSuperAdmin }) => {
  const sidebarBgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");
  const buttonBgColor = useColorModeValue("teal.500", "teal.400");
  const buttonHoverBgColor = useColorModeValue("teal.600", "teal.500");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const roleTextColor = useColorModeValue("blue.500", "yellow.300");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formType, setFormType] = useState(""); // 'user' or 'student'

  const handleOpenModal = (type) => {
    setFormType(type);
    onOpen();
  };

  return (
    <>
      <Box
        w={{ base: "full", md: "60" }}
        pos="fixed"
        top="0"
        left="0"
        h="full"
        bg={sidebarBgColor}
        p={6}
        borderRight="1px solid"
        borderColor={borderColor}
        color={textColor}
      >
        {/* Dynamic Heading */}
        <Heading mb={6} fontSize="xl" textAlign="center">
          {isSuperAdmin
            ? "Super Admin Dashboard"
            : isAdmin
            ? "Admin Dashboard"
            : "User Dashboard"}
        </Heading>

        {/* Role Display */}
        {(isSuperAdmin || isAdmin) && (
          <Text
            mb={6}
            textAlign="center"
            fontSize="sm"
            fontWeight="bold"
            color={roleTextColor}
          >
            {isSuperAdmin ? "Super Admin Role" : "Admin Role"}
          </Text>
        )}

        {/* Navigation Buttons */}
        <VStack align="stretch" spacing={4}>
          {/* Super Admin: Create User */}
          {isSuperAdmin && (
            <Button
              w="full"
              bg={buttonBgColor}
              color="white"
              leftIcon={<Icon as={FaUsers} />}
              _hover={{ bg: buttonHoverBgColor }}
              _active={{ bg: buttonHoverBgColor }}
              onClick={() => handleOpenModal("user")}
            >
              Create User
            </Button>
          )}

          {/* Admin: Create Student */}
          {isAdmin && (
            <Button
              w="full"
              bg={buttonBgColor}
              color="white"
              leftIcon={<Icon as={FaUserGraduate} />}
              _hover={{ bg: buttonHoverBgColor }}
              _active={{ bg: buttonHoverBgColor }}
              onClick={() => handleOpenModal("student")}
            >
              Create Student
            </Button>
          )}

          {/* Settings for Both Roles */}
          {(isSuperAdmin || isAdmin) && (
            <Button
              w="full"
              bg={buttonBgColor}
              color="white"
              leftIcon={<Icon as={FaCog} />}
              _hover={{ bg: buttonHoverBgColor }}
              _active={{ bg: buttonHoverBgColor }}
            >
              Settings
            </Button>
          )}

          {/* Fallback for Regular Users */}
          {!isSuperAdmin && !isAdmin && (
            <Text fontSize="sm" textAlign="center" color="gray.500">
              Explore your options in the dashboard.
            </Text>
          )}
        </VStack>
      </Box>

      {/* Modals for Creating User or Student */}
      {formType === "user" ? (
        <CreateUserModal isOpen={isOpen} onClose={onClose} />
      ) : formType === "student" ? (
        <CreateStudentModal isOpen={isOpen} onClose={onClose} />
      ) : null}
    </>
  );
};

export default Sidebar;
