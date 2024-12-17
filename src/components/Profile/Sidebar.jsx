import React, { useState } from "react";
import {
  Box,
  VStack,
  Text,
  Heading,
  useColorModeValue,
  useDisclosure,
  HStack,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useMediaQuery,
  Flex,
} from "@chakra-ui/react";
import {
  FaUsers,
  FaUserGraduate,
  FaTrophy,
  FaUser,
  FaChartBar,
  FaClipboardList,
  FaBars,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import CreateUserModal from "./CreateUserModal";
import CreateStudentModal from "./CreateStudentModal";
import Ability from "../../Permissions/Ability";
import { GetRoles } from "../../Permissions/Roles";
import SidebarButton from "./SidebarButton";

const Sidebar = () => {
  const navigate = useNavigate();

  // Theme colors
  const sidebarBgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("red.50", "teal.700");
  const iconColor = useColorModeValue("red.500", "teal.400");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formType, setFormType] = useState("");
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleOpenModal = (type) => {
    setFormType(type);
    onOpen();
  };

  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setDrawerOpen(false);
  const { studentId } = useParams();
  const SidebarContent = () => (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      height="100%"
      p={4}
    >
      <VStack align="stretch" spacing={4}>
        <SidebarButton
          icon={FaUser}
          label="Profile"
          onClick={() => {
            navigate(`/profile/${studentId}`);
            closeDrawer();
          }}
          hoverBg={hoverBg}
          iconColor={iconColor}
        />
        <Ability roles={["SUPERADMIN"]}>
          <SidebarButton
            icon={FaUsers}
            label="Create User"
            onClick={() => {
              handleOpenModal("user");
              closeDrawer();
            }}
            hoverBg={hoverBg}
            iconColor={iconColor}
          />
        </Ability>
        <Ability roles={GetRoles()}>
          <SidebarButton
            icon={FaUserGraduate}
            label="Create Student"
            onClick={() => {
              handleOpenModal("student");
              closeDrawer();
            }}
            hoverBg={hoverBg}
            iconColor={iconColor}
          />
          <SidebarButton
            icon={FaClipboardList}
            label="Manage Students"
            onClick={() => {
              navigate("/profile/manage-students");
              closeDrawer();
            }}
            hoverBg={hoverBg}
            iconColor={iconColor}
          />
          <SidebarButton
            icon={FaUsers}
            label="Manage Users"
            onClick={() => {
              navigate("/profile/manage-users");
              closeDrawer();
            }}
            hoverBg={hoverBg}
            iconColor={iconColor}
          />
        </Ability>
        <SidebarButton
          icon={FaTrophy}
          label="Rankings"
          onClick={() => {
            navigate("/profile/student-rankings");
            closeDrawer();
          }}
          hoverBg={hoverBg}
          iconColor={iconColor}
        />
        <SidebarButton
          icon={FaChartBar}
          label="Statistics"
          onClick={() => {
            navigate("/profile/student-statistics");
            closeDrawer();
          }}
          hoverBg={hoverBg}
          iconColor={iconColor}
        />
      </VStack>
      {/* Footer */}
      <Text fontSize="xs" textAlign="center" color={textColor} mb={5}>
        &copy; {new Date().getFullYear()} Dashboard
      </Text>
    </Flex>
  );

  return (
    <>
      {/* Navbar for Mobile */}
      {isMobile ? (
        <HStack
          w="full"
          p={4}
          bg={sidebarBgColor}
          borderBottom="1px solid"
          borderColor={borderColor}
          justifyContent="space-between"
        >
          <Heading fontSize="lg" color={textColor}>
            Dashboard
          </Heading>
          <IconButton
            icon={<FaBars />}
            onClick={toggleDrawer}
            aria-label="Open Menu"
            bg={hoverBg}
            _hover={{ bg: useColorModeValue("red.100", "teal.600") }}
          />
        </HStack>
      ) : (
        // Sidebar for Desktop
        <Box
          w="60"
          pos="fixed"
          top="0"
          left="0"
          h="full"
          bg={sidebarBgColor}
          borderRight="1px solid"
          borderColor={borderColor}
          p={6}
          color={textColor}
        >
          <Heading mb={6} fontSize="xl" textAlign="center">
            Dashboard
          </Heading>
          {SidebarContent()}
        </Box>
      )}

      {/* Drawer for Mobile */}
      <Drawer isOpen={isDrawerOpen} placement="left" onClose={closeDrawer}>
        <DrawerOverlay />
        <DrawerContent bg={sidebarBgColor}>
          <DrawerCloseButton />
          <DrawerHeader fontSize="lg" textAlign="center" color={textColor}>
            Dashboard
          </DrawerHeader>
          <DrawerBody>{SidebarContent()}</DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Modals */}
      {formType === "user" && (
        <CreateUserModal isOpen={isOpen} onClose={onClose} />
      )}
      {formType === "student" && (
        <CreateStudentModal isOpen={isOpen} onClose={onClose} />
      )}
    </>
  );
};

export default React.memo(Sidebar);
