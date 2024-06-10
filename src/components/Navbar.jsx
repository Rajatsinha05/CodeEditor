import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Flex,
  Box,
  Button,
  useColorMode,
  IconButton,
  Tooltip,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FaHome,
  FaCode,
  FaUser,
  FaPlus,
  FaSignInAlt,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaBars,
} from "react-icons/fa";
import "../CSS/Navbar.css";

const Navbar = ({ isLoggedIn }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const iconSize = "1.5rem";

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const isMobileOrTablet = useBreakpointValue({ base: true, md: false });

  return (
    <nav className="navbar">
      {isMobileOrTablet ? (
        <Flex alignItems="center" justifyContent="flex-end">
          <IconButton
            icon={<FaBars size={iconSize} />}
            aria-label="Open Drawer"
            onClick={handleDrawerOpen}
            ml={4}
          />
        </Flex>
      ) : (
        <Flex alignItems="center" justifyContent="space-between">
          <Box>
            <NavLink
              exact
              to="/"
              className="nav-link"
              activeClassName="active"
            >
              <Tooltip label="Home" placement="right">
                <IconButton
                  icon={<FaHome size={iconSize} />}
                  aria-label="Home"
                />
              </Tooltip>
            </NavLink>
            <NavLink
              to="/problems"
              className="nav-link"
              activeClassName="active"
            >
              <Tooltip label="Problems" placement="right">
                <IconButton
                  icon={<FaCode size={iconSize} />}
                  aria-label="Problems"
                />
              </Tooltip>
            </NavLink>
            <NavLink
              to="/addQuestion"
              className="nav-link"
              activeClassName="active"
            >
              <Tooltip label="Add Question" placement="right">
                <IconButton
                  icon={<FaPlus size={iconSize} />}
                  aria-label="Add Question"
                />
              </Tooltip>
            </NavLink>
            <NavLink
              to="/createContest"
              className="nav-link"
              activeClassName="active"
            >
              <Tooltip label="createContest" placement="right">
                <IconButton
                  icon={<FaPlus size={iconSize} />}
                  aria-label="Add Question"
                />
              </Tooltip>
            </NavLink>
          </Box>
          <Flex alignItems="center">
            <Tooltip
              label={`Toggle ${
                colorMode === "light" ? "Dark" : "Light"
              } Mode`}
              placement="right"
            >
              <IconButton
                icon={
                  colorMode === "light" ? (
                    <FaMoon size={iconSize} />
                  ) : (
                    <FaSun size={iconSize} />
                  )
                }
                onClick={toggleColorMode}
                aria-label="Toggle Color Mode"
              />
            </Tooltip>
            {isLoggedIn ? (
              <Button ml={4}>
                <NavLink
                  to="/profile"
                  className="nav-link"
                  activeClassName="active"
                >
                  <FaUser size={iconSize} /> Profile
                </NavLink>
              </Button>
            ) : (
              <>
                <Button ml={4}>
                  <NavLink
                    to="/login"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <FaSignInAlt size={iconSize} /> Login
                  </NavLink>
                </Button>
                <Button ml={4}>
                  <NavLink
                    to="/signup"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <FaSignOutAlt size={iconSize} /> Signup
                  </NavLink>
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      )}
      <Drawer
        placement="left"
        onClose={handleDrawerClose}
        isOpen={isDrawerOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              <NavLink
                exact
                to="/"
                className="nav-link"
                activeClassName="active"
                onClick={handleDrawerClose}
              >
                Home
              </NavLink>
              <NavLink
                to="/problems"
                className="nav-link"
                activeClassName="active"
                onClick={handleDrawerClose}
              >
                Problems
              </NavLink>
              <NavLink
                to="/addQuestion"
                className="nav-link"
                activeClassName="active"
                onClick={handleDrawerClose}
              >
                Add Question
              </NavLink>
              {isLoggedIn ? (
                <NavLink
                  to="/profile"
                  className="nav-link"
                  activeClassName="active"
                  onClick={handleDrawerClose}
                >
                  Profile
                </NavLink>
              ) : (
                <>
                 
                 <Login isOpen={!isLogin} />
                  <NavLink
                    to="/signup"
                    className="nav-link"
                    activeClassName="active"
                    onClick={handleDrawerClose}
                  >
                    Signup
                  </NavLink>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </nav>
  );
};

export default Navbar;