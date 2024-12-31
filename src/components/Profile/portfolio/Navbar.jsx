import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Text,
  Link,
  Spacer,
  useColorMode,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { FaMoon, FaSun, FaBars } from "react-icons/fa";

const Navbar = ({ student }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isScrolled, setIsScrolled] = useState(false);

  // Colors
  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");
  const hoverColor = useColorModeValue("red.500", "teal.300");

  // Scroll Event
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      bg={isScrolled ? bgColor : "transparent"}
      color={textColor}
      px={{ base: 4, md: 10 }}
      py={4}
      position="fixed"
      width="100%"
      zIndex="1000"
      boxShadow={isScrolled ? "md" : "none"}
      transition="all 0.4s ease-in-out"
    >
      <Flex align="center">
        {/* Brand Section */}
        <Text
          fontWeight="bold"
          fontSize={{ base: "lg", md: "2xl" }}
          letterSpacing="wide"
          transition="all 0.3s"
          color={hoverColor}
        >
          {isScrolled ? student.name : "Welcome to My Portfolio"}
        </Text>

        <Spacer />

        {/* Desktop Navigation */}
        <HStack
          spacing={8}
          display={{ base: "none", md: "flex" }}
          fontWeight="medium"
          fontSize="md"
        >
          <NavItem label="Home" href="#home" hoverColor={hoverColor} />
          <NavItem label="About" href="#about" hoverColor={hoverColor} />
          <NavItem label="Projects" href="#projects" hoverColor={hoverColor} />
          <NavItem
            label="Certificates"
            href="#certificates"
            hoverColor={hoverColor}
          />
          <NavItem label="Skills" href="#skills" hoverColor={hoverColor} />
        </HStack>

        {/* Right Section */}
        <HStack spacing={4}>
          {/* Theme Switch */}
          <IconButton
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            aria-label="Toggle Theme"
            onClick={toggleColorMode}
            variant="ghost"
            _hover={{ color: hoverColor, transform: "scale(1.1)" }}
          />

          {/* Mobile Menu */}
          <IconButton
            icon={<FaBars />}
            aria-label="Menu"
            display={{ base: "flex", md: "none" }}
            variant="ghost"
            _hover={{ color: hoverColor }}
          />
        </HStack>
      </Flex>
    </Box>
  );
};

// Navigation Item Component
const NavItem = ({ label, href, hoverColor }) => {
  return (
    <Link
      href={href}
      _hover={{
        color: hoverColor,
        textDecoration: "none",
        transform: "scale(1.05)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {label}
    </Link>
  );
};

export default Navbar;
