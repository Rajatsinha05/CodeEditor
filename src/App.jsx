import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AllRoutes from "./Routes/AllRoutes";
import "react-quill/dist/quill.snow.css";
import { trackPageView } from "../analytics";

function App() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname); // Track each page visit
  }, [location]);

  const { isLogin, user } = useSelector((store) => store.data);
  const { colorMode } = useColorMode();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerClose = () => setIsDrawerOpen(false);

  // Dynamic styles based on color mode
  const styles = {
    hoverBg: useColorModeValue("red.400", "teal.400"),
    bgColor: useColorModeValue("gray.50", "gray.900"),
    textColor: useColorModeValue("gray.800", "white"),
    cardBgColor: useColorModeValue("white", "gray.800"),
    hoverColor: useColorModeValue("white", "white"),
  };

  // Hide Navbar on specific routes
  const hideNavbar =
    location.pathname.startsWith("/portfolio/") ||
    location.pathname.startsWith("/register");
  const isRegisterRoute = location.pathname.startsWith("/register");

  return (
    <>
      {/* Conditionally render Navbar */}
      {!hideNavbar && <Navbar />}

      <AllRoutes />

      {/* Conditional Login Modal */}
      {!isLogin && !isRegisterRoute && (
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
            bg={styles.bgColor}
          >
            <Text
              fontSize="xl"
              fontWeight="bold"
              mb={4}
              color={styles.textColor}
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
              bg={styles.hoverBg}
              color="white"
              size="lg"
              onClick={() => window.location.reload()}
              _hover={{
                bg: styles.hoverBg,
                color: styles.hoverColor,
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
