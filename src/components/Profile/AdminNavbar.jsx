import React from "react";
import {
  Box,
  Flex,
  IconButton,
  Button,
  useColorMode,
  Tooltip,
  useColorModeValue,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { FaMoon, FaSun, FaBars, FaSignOutAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookie from "js-cookie";

const Navbar = ({ onOpen }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isLogin } = useSelector((store) => store.data);

  const handleLogOut = () => {
    Cookie.remove("token");
    window.location.reload();
  };

  const bgColor = useColorModeValue("blue.600", "blue.900");
  const textColor = useColorModeValue("white", "gray.200");

  return (
    <Box
      bg={bgColor}
      color={textColor}
      px={6}
      py={4}
      position="fixed"
      top="0"
      width="100%"
      zIndex="10"
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          icon={<FaBars />}
          aria-label="Open Menu"
          display={{ base: "block", md: "none" }}
          onClick={onOpen}
          colorScheme="whiteAlpha"
          mr={4}
        />
        <Heading size="lg" color="white">
          Admin Dashboard
        </Heading>
        <HStack spacing={8} display={{ base: "none", md: "flex" }}>
          <NavLink to="/" className="nav-link">
            <Button variant="link" color="white">
              Home
            </Button>
          </NavLink>
          <NavLink to="/problems" className="nav-link">
            <Button variant="link" color="white">
              Problems
            </Button>
          </NavLink>
          <NavLink to="/ranking" className="nav-link">
            <Button variant="link" color="white">
              Rankings
            </Button>
          </NavLink>
          <Tooltip
            label={`${colorMode === "light" ? "Dark Mode" : "Light Mode"}`}
          >
            <IconButton
              icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
              onClick={toggleColorMode}
              variant="ghost"
              color="white"
            />
          </Tooltip>
          {isLogin && (
            <Tooltip label="Log Out">
              <IconButton
                icon={<FaSignOutAlt />}
                onClick={handleLogOut}
                variant="ghost"
                color="white"
              />
            </Tooltip>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default React.memo(Navbar);
