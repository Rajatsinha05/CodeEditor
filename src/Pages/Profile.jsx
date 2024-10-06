import React from "react";
import { Box, Flex, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import ProfileTabs from "../components/Profile/ProfileTabs";
import Sidebar from "../components/Profile/Sidebar";
import MobileDrawer from "../components/Profile/MobileDrawer";
import Students from "../components/Profile/Students"; // Import Students component

const Profile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useSelector((store) => store.data);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";
  const isSuperAdmin = user?.role === "SUPERADMIN";
  const isStudent = user?.role === "STUDENT";

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.900", "gray.100");

  return (
    <Flex minH="100vh" bg={bgColor}>
      {/* Sidebar for Admin and Superadmin */}
      {(isAdmin || isSuperAdmin) && (
        <Sidebar isAdmin={isAdmin} isSuperAdmin={isSuperAdmin} onOpen={onOpen} />
      )}

      {/* Main Content Area */}
      <Box flex="1" ml={{ base: 0, md: isAdmin || isSuperAdmin ? "60" : 0 }} p={5} bg={bgColor} color={textColor}>
        {/* Drawer for Mobile Sidebar */}
        {(isAdmin || isSuperAdmin) && (
          <MobileDrawer
            isOpen={isOpen}
            onClose={onClose}
            isAdmin={isAdmin}
            isSuperAdmin={isSuperAdmin}
          />
        )}

        {/* Tabs for Profile, Stats, and Rankings */}
        <ProfileTabs user={user} isAdmin={isAdmin} isSuperAdmin={isSuperAdmin} />

        {/* Display Students Table for Admin and Superadmin */}
        
      </Box>
    </Flex>
  );
};

export default Profile;
