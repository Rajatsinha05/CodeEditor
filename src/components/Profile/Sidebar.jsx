import React, { useState } from "react";
import {
  Box,
  VStack,
  Button,
  Text,
  Icon,
  Heading,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaUsers,
  FaUserGraduate,
  FaCog,
  FaTrophy,
  FaUser,
  FaChartBar,
  FaTools,
  FaClipboardList,
} from "react-icons/fa";
import CreateUserModal from "./CreateUserModal";
import CreateStudentModal from "./CreateStudentModal";

const Sidebar = ({ isAdmin, isSuperAdmin }) => {
  // Theme colors
  const sidebarBgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("red.50", "teal.700");
  const iconColor = useColorModeValue("red.500", "teal.400"); // Red for light mode, teal for dark mode

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formType, setFormType] = useState(""); // 'user' or 'student'

  const handleOpenModal = (type) => {
    setFormType(type);
    onOpen();
  };

  return (
    <>
      {/* Sidebar */}
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
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        {/* Dashboard Header */}
        <Box>
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
              color={iconColor}
            >
              {isSuperAdmin ? "Super Admin Role" : "Admin Role"}
            </Text>
          )}

          {/* Navigation */}
          <VStack align="stretch" spacing={4}>
            <SidebarButton
              icon={FaUser}
              label="Profile"
              onClick={() => console.log("Profile clicked")}
              hoverBg={hoverBg}
              iconColor={iconColor}
            />

            {isSuperAdmin && (
              <SidebarButton
                icon={FaUsers}
                label="Create User"
                onClick={() => handleOpenModal("user")}
                hoverBg={hoverBg}
                iconColor={iconColor}
              />
            )}

            {isAdmin && (
              <SidebarButton
                icon={FaUserGraduate}
                label="Create Student"
                onClick={() => handleOpenModal("student")}
                hoverBg={hoverBg}
                iconColor={iconColor}
              />
            )}

            {(isSuperAdmin || isAdmin) && (
              <>
                <SidebarButton
                  icon={FaClipboardList}
                  label="Manage Students"
                  onClick={() => console.log("Manage Students clicked")}
                  hoverBg={hoverBg}
                  iconColor={iconColor}
                />
                <SidebarButton
                  icon={FaUsers}
                  label="Manage Users"
                  onClick={() => console.log("Manage Users clicked")}
                  hoverBg={hoverBg}
                  iconColor={iconColor}
                />
              </>
            )}

            <SidebarButton
              icon={FaTrophy}
              label="Rankings"
              onClick={() => console.log("Rankings clicked")}
              hoverBg={hoverBg}
              iconColor={iconColor}
            />

            <SidebarButton
              icon={FaChartBar}
              label="Statistics"
              onClick={() => console.log("Statistics clicked")}
              hoverBg={hoverBg}
              iconColor={iconColor}
            />

            {(isSuperAdmin || isAdmin) && (
              <SidebarButton
                icon={FaCog}
                label="Settings"
                onClick={() => console.log("Settings clicked")}
                hoverBg={hoverBg}
                iconColor={iconColor}
              />
            )}
          </VStack>
        </Box>

        {/* Footer */}
        <Box>
          <Text fontSize="xs" textAlign="center" color={textColor}>
            &copy; {new Date().getFullYear()} Dashboard
          </Text>
        </Box>
      </Box>

      {/* Modals for Creating User or Student */}
      {formType === "user" && (
        <CreateUserModal isOpen={isOpen} onClose={onClose} />
      )}
      {formType === "student" && (
        <CreateStudentModal isOpen={isOpen} onClose={onClose} />
      )}
    </>
  );
};

// Sidebar Button Component
const SidebarButton = ({ icon, label, onClick, hoverBg, iconColor }) => {
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Button
      variant="ghost"
      w="full"
      justifyContent="flex-start"
      leftIcon={<Icon as={icon} boxSize={5} color={iconColor} />}
      color={textColor}
      _hover={{ bg: hoverBg }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default React.memo(Sidebar);
