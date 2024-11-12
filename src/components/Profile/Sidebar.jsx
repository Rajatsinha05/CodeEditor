import React from "react";
import {
  Box,
  Heading,
  VStack,
  Button,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import CreateUserModal from "./CreateUserModal";
import CreateStudentModal from "./CreateStudentModal";

const Sidebar = ({ isAdmin, isSuperAdmin }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const sidebarBgColor = useColorModeValue("gray.100", "gray.800");
  const primaryColor = useColorModeValue("red.500", "teal.200");
  const buttonBgColor = useColorModeValue("red.400", "teal.500");
  const buttonHoverColor = useColorModeValue("red.300", "teal.400");
  const buttonTextColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.900", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [formType, setFormType] = React.useState(""); // 'user' or 'student'

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
        display={{ base: "none", md: "block" }}
        color={textColor}
        zIndex="1"
        borderRight="1px"
        borderColor={borderColor}
      >
        <Heading mb={8} textAlign="center" color={primaryColor} fontSize="xl">
          Admin Dashboard
        </Heading>
        <VStack align="start" spacing={4}>
          {isSuperAdmin && (
            <Button
              w="full"
              bg={buttonBgColor}
              color={buttonTextColor}
              _hover={{ bg: buttonHoverColor }}
              _active={{ bg: primaryColor }}
              onClick={() => handleOpenModal("user")}
            >
              Create User
            </Button>
          )}
          {isAdmin && (
            <Button
              w="full"
              bg={buttonBgColor}
              color={buttonTextColor}
              _hover={{ bg: buttonHoverColor }}
              _active={{ bg: primaryColor }}
              onClick={() => handleOpenModal("student")}
            >
              Create Student
            </Button>
          )}
        </VStack>
      </Box>

      {/* Modals for Creating User or Student */}
      {formType === "user" ? (
        <CreateUserModal isOpen={isOpen} onClose={onClose} mode="Create" />
      ) : formType === "student" ? (
        <CreateStudentModal isOpen={isOpen} onClose={onClose} />
      ) : null}
    </>
  );
};

export default Sidebar;
