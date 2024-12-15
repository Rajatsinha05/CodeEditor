import React from "react";
import {
  Box,
  Flex,
  Divider,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import Sidebar from "../components/Profile/Sidebar";
import { Outlet } from "react-router-dom";

const Profile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Detect if screen size is mobile
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  // Theme Colors
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.900", "gray.100");

  // Sidebar width
  const sidebarWidth = isMobile ? "100%" : "60";

  return (
    <Flex
      minH="100vh"
      bg={bgColor}
      flexDirection={isMobile ? "column" : "row"}
    >
      {/* Sidebar */}
      <Box
        w={sidebarWidth} // Full width on mobile, fixed width on desktop
        bg={bgColor}
        display="block"
        boxShadow="md"
      >
        <Sidebar onOpen={onOpen} />
      </Box>

      {/* Content Area */}
      <Box
        w="100%" // Ensure 100% width for mobile
        flex="1"
        p={4}
        bg={bgColor}
        color={textColor}
      >
        <Divider mb={4} />
        {/* Nested Routes */}
        <Outlet />
      </Box>
    </Flex>
  );
};

export default React.memo(Profile);
