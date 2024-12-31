import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom"; // Import useLocation
import Navbar from "./components/Navbar";
import AllRoutes from "./Routes/AllRoutes";
import "react-quill/dist/quill.snow.css";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isLogin } = useSelector((store) => store.data);
  const { colorMode } = useColorMode();
  const location = useLocation(); // Get the current route

  const handleDrawerClose = () => setIsDrawerOpen(false);

  // Define dynamic styles based on color mode
  const hoverBg = useColorModeValue("red.400", "teal.400");
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const hoverColor = useColorModeValue("white", "white");

  const { user } = useSelector((store) => store.data);

  // Hide Navbar on /portfolio/* routes
  const hideNavbar = location.pathname.startsWith("/portfolio/");

  return (
    <>
      {/* Conditionally render Navbar */}
      {!hideNavbar && <Navbar />}

      <AllRoutes />

      {/* Conditional Login Modal */}
      {!isLogin && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex="1000"
          display="flex"
          justifyContent="center"
          alignItems="center"
          backdropFilter="blur(8px)"
          bg="rgba(0, 0, 0, 0.5)"
        >
          <Box
            p={8}
            borderRadius="md"
            boxShadow="lg"
            textAlign="center"
            bg={colorMode === "light" ? "white" : "gray.800"}
          >
            <Text
              fontSize="xl"
              fontWeight="bold"
              mb={4}
              color={colorMode === "light" ? "gray.800" : "white"}
            >
              Welcome to our platform!
            </Text>
            <Text
              mb={6}
              color={colorMode === "light" ? "gray.700" : "gray.300"}
            >
              You are not logged in. Please log in to access the content.
            </Text>
            <Button
              bg={hoverBg}
              color="white"
              size="lg"
              onClick={() => window.location.reload()}
              _hover={{
                bg: hoverBg,
                color: hoverColor,
                transform: "scale(1.05)",
                transition: "all 0.3s",
              }}
            >
              Login
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}

export default App;
