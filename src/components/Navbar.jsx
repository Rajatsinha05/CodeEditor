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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Text,
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
import Cookie from "js-cookie";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const iconSize = "1.5rem";
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { isLogin, user } = useSelector((store) => store.data);
  const isMobileOrTablet = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (!isLogin) {
      setIsLoginModalOpen(true);
    } else {
      setIsLoginModalOpen(false); // Ensure modal closes when login succeeds
    }
  }, [isLogin]);

  const handleLogOut = () => {
    Cookie.remove("token");
    Cookie.remove("userToken");
    window.location.reload();
  };

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);
  const handleLoginModalClose = () => setIsLoginModalOpen(false);

  const hoverColor = useColorModeValue("#f44336", "teal.400");
  const hoverBg = useColorModeValue("white", "gray.200");

  const renderNavLinks = () => (
    <>
      <NavLink exact to="/" className="nav-link" activeClassName="active">
        <Tooltip label="Home" placement="bottom">
          <IconButton
            icon={<FaHome size={iconSize} />}
            aria-label="Home"
            variant="ghost"
            _hover={{ color: hoverColor, bg: hoverBg }}
            transition="all 0.3s"
          />
        </Tooltip>
      </NavLink>
      <NavLink to="/problems" className="nav-link" activeClassName="active">
        <Tooltip label="Problems" placement="bottom">
          <IconButton
            icon={<FaCode size={iconSize} />}
            aria-label="Problems"
            variant="ghost"
            _hover={{ color: hoverColor, bg: hoverBg }}
            transition="all 0.3s"
          />
        </Tooltip>
      </NavLink>
      {isLogin && (user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
        <>
          <NavLink to="/addQuestion" className="nav-link" activeClassName="active">
            <Tooltip label="Add Question" placement="bottom">
              <IconButton
                icon={<FaPlus size={iconSize} />}
                aria-label="Add Question"
                variant="ghost"
                _hover={{ color: hoverColor, bg: hoverBg }}
                transition="all 0.3s"
              />
            </Tooltip>
          </NavLink>
          <NavLink to="/createContest" className="nav-link" activeClassName="active">
            <Tooltip label="Create Contest" placement="bottom">
              <IconButton
                icon={<FaPlus size={iconSize} />}
                aria-label="Create Contest"
                variant="ghost"
                _hover={{ color: hoverColor, bg: hoverBg }}
                transition="all 0.3s"
              />
            </Tooltip>
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <Box
      position="relative"
      zIndex="10"
      bg={useColorModeValue("gray.50", "gray.900")}
      boxShadow="sm"
      px={4}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {isMobileOrTablet ? (
          <IconButton
            icon={<FaBars size={iconSize} />}
            aria-label="Open Drawer"
            onClick={handleDrawerOpen}
            variant="ghost"
            _hover={{ color: hoverColor, bg: hoverBg }}
            transition="all 0.3s"
          />
        ) : (
          <HStack spacing={4}>{renderNavLinks()}</HStack>
        )}

        <Flex alignItems="center">
          <Tooltip label={`${colorMode === "light" ? "Dark Mode" : "Light Mode"}`} placement="bottom">
            <IconButton
              icon={colorMode === "light" ? <FaMoon size={iconSize} /> : <FaSun size={iconSize} />}
              onClick={toggleColorMode}
              aria-label="Toggle Color Mode"
              variant="ghost"
              _hover={{ color: hoverColor, bg: hoverBg }}
              transition="all 0.3s"
            />
          </Tooltip>
          {isLogin ? (
            <>
              <Menu>
                <MenuButton as={Button} ml={4} variant="ghost" colorScheme="teal">
                  <Text fontWeight="bold">Hello, {user.name}</Text>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={handleLogOut}>
                    <FaSignOutAlt style={{ marginRight: "8px" }} /> Log Out
                  </MenuItem>
                </MenuList>
              </Menu>
              <NavLink to="/profile" className="nav-link" activeClassName="active">
                <Tooltip label="Profile" placement="bottom">
                  <IconButton
                    icon={<FaUser size={iconSize} />}
                    aria-label="Profile"
                    ml={4}
                    variant="ghost"
                    _hover={{ color: hoverColor, bg: hoverBg }}
                    transition="all 0.3s"
                  />
                </Tooltip>
              </NavLink>
            </>
          ) : (
            <Button
              ml={4}
              variant="solid"
              colorScheme="teal"
              leftIcon={<FaSignInAlt size={iconSize} />}
              onClick={() => setIsLoginModalOpen(true)}
            >
              Login
            </Button>
          )}
        </Flex>
      </Flex>

      <Drawer placement="left" onClose={handleDrawerClose} isOpen={isDrawerOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton onClick={handleDrawerClose} />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              <NavLink exact to="/" className="nav-link" activeClassName="active" onClick={handleDrawerClose}>
                Home
              </NavLink>
              <NavLink to="/problems" className="nav-link" activeClassName="active" onClick={handleDrawerClose}>
                Problems
              </NavLink>
              {isLogin && (
                <>
                  <NavLink to="/profile" className="nav-link" activeClassName="active" onClick={handleDrawerClose}>
                    Profile
                  </NavLink>
                  {user?.role === "ADMIN" || user?.role === "SUPERADMIN" ? (
                    <>
                      <NavLink
                        to="/addQuestion"
                        className="nav-link"
                        activeClassName="active"
                        onClick={handleDrawerClose}
                      >
                        Add Question
                      </NavLink>
                      <NavLink
                        to="/createContest"
                        className="nav-link"
                        activeClassName="active"
                        onClick={handleDrawerClose}
                      >
                        Create Contest
                      </NavLink>
                    </>
                  ) : null}
                </>
              )}
              {!isLogin && (
                <NavLink
                  to="/login"
                  className="nav-link"
                  activeClassName="active"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  Login
                </NavLink>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Login isOpen={isLoginModalOpen} onClose={handleLoginModalClose} />
    </Box>
  );
};

export default Navbar;
