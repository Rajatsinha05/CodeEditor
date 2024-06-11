import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
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
  useDisclosure,
  useColorModeValue,
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
import Login from "../Pages/Login";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const iconSize = "1.5rem";
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isLogin, user } = useSelector((store) => store.data);
  const isMobileOrTablet = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!isLogin) {
      onOpen();
    }
  }, [isLogin, onOpen]);

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  const renderNavLinks = () => (
    <>
      <NavLink exact to="/" className="nav-link" activeClassName="active"  zIndex="10">
        <Tooltip label="Home" placement="right">
          <IconButton icon={<FaHome size={iconSize} />} aria-label="Home" />
        </Tooltip>
      </NavLink>
      <NavLink to="/problems" className="nav-link" activeClassName="active">
        <Tooltip label="Problems" placement="right">
          <IconButton icon={<FaCode size={iconSize} />} aria-label="Problems" />
        </Tooltip>
      </NavLink>
      {isLogin && (
        <>
          <NavLink to="/addQuestion" className="nav-link" activeClassName="active">
            <Tooltip label="Add Question" placement="right">
              <IconButton icon={<FaPlus size={iconSize} />} aria-label="Add Question" />
            </Tooltip>
          </NavLink>
          <NavLink to="/createContest" className="nav-link" activeClassName="active">
            <Tooltip label="Create Contest" placement="right">
              <IconButton icon={<FaPlus size={iconSize} />} aria-label="Create Contest" />
            </Tooltip>
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <Box position="relative"  zIndex="10 " bg={isOpen ? "rgba(0, 0, 0, 0.5)" : "transparent"}>
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
            <Box>{renderNavLinks()}</Box>
            <Flex alignItems="center">
              <Tooltip label={`Toggle ${colorMode === "light" ? "Dark" : "Light"} Mode`} placement="right">
                <IconButton
                  icon={colorMode === "light" ? <FaMoon size={iconSize} /> : <FaSun size={iconSize} />}
                  onClick={toggleColorMode}
                  aria-label="Toggle Color Mode"
                />
              </Tooltip>
              {isLogin ? (
                <>
                  <Box ml={4}>Hello, {user.username}</Box>
                  <Button ml={4}>
                    <NavLink to="/profile" className="nav-link" activeClassName="active">
                      <FaUser size={iconSize} /> Profile
                    </NavLink>
                  </Button>
                </>
              ) : (
                <>
                  <Button ml={4} onClick={onOpen}>
                    <FaSignInAlt size={iconSize} /> Login
                  </Button>
                  {/* <Button ml={4}>
                    <NavLink to="/signup" className="nav-link" activeClassName="active">
                      <FaSignOutAlt size={iconSize} /> Signup
                    </NavLink>
                  </Button> */}
                </>
              )}
            </Flex>
          </Flex>
        )}
        <Drawer placement="left" onClose={handleDrawerClose} isOpen={isDrawerOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <VStack spacing={4}>
                <NavLink exact to="/" className="nav-link" activeClassName="active" onClick={handleDrawerClose}>
                  Home
                </NavLink>
                <NavLink to="/problems" className="nav-link" activeClassName="active" onClick={handleDrawerClose}>
                  Problems
                </NavLink>
                {isLogin ? (
                  <>
                    <NavLink to="/addQuestion" className="nav-link" activeClassName="active" onClick={handleDrawerClose}>
                      Add Question
                    </NavLink>
                    <NavLink to="/profile" className="nav-link" activeClassName="active" onClick={handleDrawerClose}>
                      Profile
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" className="nav-link" activeClassName="active" onClick={handleDrawerClose}>
                      Login
                    </NavLink>
                  </>
                )}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </nav>
      {!isLogin && <Login isOpen={isOpen} onClose={onClose} />}
    </Box>
  );
};

export default Navbar;
