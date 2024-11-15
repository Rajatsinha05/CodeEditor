import { Box, Button, Text, useColorMode, useColorModeValue } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import AllRoutes from "./Routes/AllRoutes";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useState } from "react";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isLogin } = useSelector((store) => store.data);
  const { colorMode } = useColorMode();
  const handleDrawerClose = () => setIsDrawerOpen(false);

  // Define hover styles based on color mode
  const hoverBg = useColorModeValue('#f44336', 'blue.600');
  const hoverColor = useColorModeValue('white', 'white');

  return (
    <>
      <Navbar />
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
              colorScheme="blue"
              size="lg"
              onClick={() => window.location.reload()}
              _hover={{ bg: hoverBg, color: hoverColor }}
            >
              Login
            </Button>
          </Box>
        </Box>
      )}
      <AllRoutes />
    </>
  );
}

export default App;
