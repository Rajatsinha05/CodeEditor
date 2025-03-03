import React, { useEffect, useState } from "react";
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
import { initOneSignal } from "./notification/ongSingal";
import {
  NotificationPermissionModal,
  onMessageListener,
  requestForToken,
} from "./notification/request";

function App() {
  const location = useLocation();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  useEffect(() => {
    const checkNotificationPermission = async () => {
      const permission = Notification.permission;
      if (permission === "default") {
        setIsNotificationModalOpen(true);
      } else if (permission === "granted") {
        await requestForToken();
      }
    };

    checkNotificationPermission();

    onMessageListener()
      .then((payload) => {
        alert(`New notification: ${payload.notification.title}`);
      })
      .catch((err) => console.log("Failed to receive notification:", err));
  }, []);

  const { isLogin } = useSelector((store) => store.data);
  const { colorMode } = useColorMode();

  const styles = {
    hoverBg: useColorModeValue("red.400", "teal.400"),
    bgColor: useColorModeValue("gray.50", "gray.900"),
    textColor: useColorModeValue("gray.800", "white"),
    cardBgColor: useColorModeValue("white", "gray.800"),
    hoverColor: useColorModeValue("white", "white"),
  };

  const hideNavbar =
    location.pathname.startsWith("/portfolio/") ||
    location.pathname.startsWith("/register");
  const isRegisterRoute = location.pathname.startsWith("/register");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <AllRoutes />

      {/* Notification Permission Modal */}
      <NotificationPermissionModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

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
