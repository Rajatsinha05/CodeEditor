import React from "react";
import { Box, Heading, VStack, Button } from "@chakra-ui/react";
import { useColorModeValue, useDisclosure } from "@chakra-ui/react";
import CreateUserModal from "./CreateUserModal";
import CreateStudentModal from "./CreateStudentModal";

const Sidebar = ({ isAdmin, isSuperAdmin }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const sidebarBgColor = useColorModeValue("gray.100", "gray.700");
  const primaryColor = useColorModeValue("blue.500", "blue.200");
  const textColor = useColorModeValue("gray.900", "gray.100");
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
        p={4}
        display={{ base: "none", md: "block" }}
        color={textColor}
        zIndex="1"
      >
        <Heading mb={6} textAlign="center" color={primaryColor}>
          Admin Dashboard
        </Heading>
        <VStack align="start" spacing={4}>
          {isSuperAdmin && (
            <Button
              w="full"
              colorScheme="blue"
              onClick={() => handleOpenModal("user")}
            >
              Create User
            </Button>
          )}
          {isAdmin && (
            <Button
              w="full"
              colorScheme="blue"
              onClick={() => handleOpenModal("student")}
            >
              Create Student
            </Button>
          )}
        </VStack>
      </Box>

      {/* Modal for Creating User or Student */}
      {formType === "user" && (
        <CreateUserModal isOpen={isOpen} onClose={onClose} />
      )}
      {formType === "student" && (
        <CreateStudentModal isOpen={isOpen} onClose={onClose} />
      )}
    </>
  );
};

export default Sidebar;
