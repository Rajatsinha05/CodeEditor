import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Box,
  Text,
  Select,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";

// Main SettingsModal Component
const SettingsModal = ({
  isOpen,
  onClose,
  preferences,
  setPreferences,
  theme,
  setTheme,
  fontSize,
  setFontSize,
  layout,
  setLayout,
  onLanguageChange, // Explicit language change handler
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent
        bg={useColorModeValue("white", "gray.800")}
        borderRadius="md"
      >
        <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold">
          Editor Settings
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            <LanguageSelector
              language={preferences.language}
              setLanguage={onLanguageChange}
            />
            <ThemeSelector theme={theme} setTheme={setTheme} />
            <FontSizeSelector fontSize={fontSize} setFontSize={setFontSize} />
            <LayoutSelector layout={layout} setLayout={setLayout} />
            <FeatureToggles
              showSnippets={preferences.showSnippets}
              showLineNumbers={preferences.showLineNumbers}
              toggleFeature={(feature) =>
                setPreferences((prev) => ({
                  ...prev,
                  [feature]: !prev[feature],
                }))
              }
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" size="lg" w="full" onClick={onClose}>
            Save Settings
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// LanguageSelector Component
const LanguageSelector = ({ language, setLanguage }) => {
  return (
    <Box>
      <Text fontWeight="semibold" mb={2}>
        Programming Language
      </Text>
      <Select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        bg={useColorModeValue("gray.100", "gray.700")}
        color={useColorModeValue("gray.800", "white")}
        borderColor={useColorModeValue("gray.300", "gray.600")}
        _hover={{ borderColor: "teal.500" }}
      >
        <option value="java">Java</option>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
      </Select>
    </Box>
  );
};

// ThemeSelector Component
const ThemeSelector = ({ theme, setTheme }) => {
  return (
    <Box>
      <Text fontWeight="semibold" mb={2}>
        Editor Theme
      </Text>
      <Select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        bg={useColorModeValue("gray.100", "gray.700")}
        color={useColorModeValue("gray.800", "white")}
        borderColor={useColorModeValue("gray.300", "gray.600")}
        _hover={{ borderColor: "teal.500" }}
      >
        <option value="vs-dark">Dark Theme</option>
        <option value="vs-light">Light Theme</option>
        <option value="high-contrast">High Contrast</option>
        <option value="monokai">Monokai</option>
      </Select>
    </Box>
  );
};

// FontSizeSelector Component
const FontSizeSelector = ({ fontSize, setFontSize }) => {
  return (
    <Box>
      <Text fontWeight="semibold" mb={2}>
        Font Size
      </Text>
      <Select
        value={fontSize}
        onChange={(e) => setFontSize(parseInt(e.target.value))}
        bg={useColorModeValue("gray.100", "gray.700")}
        color={useColorModeValue("gray.800", "white")}
        borderColor={useColorModeValue("gray.300", "gray.600")}
        _hover={{ borderColor: "teal.500" }}
      >
        <option value={12}>12px</option>
        <option value={14}>14px</option>
        <option value={16}>16px</option>
        <option value={18}>18px</option>
        <option value={20}>20px</option>
      </Select>
    </Box>
  );
};

// LayoutSelector Component
const LayoutSelector = ({ layout, setLayout }) => {
  return (
    <Box>
      <Text fontWeight="semibold" mb={2}>
        Editor Layout
      </Text>
      <Select
        value={layout}
        onChange={(e) => setLayout(e.target.value)}
        bg={useColorModeValue("gray.100", "gray.700")}
        color={useColorModeValue("gray.800", "white")}
        borderColor={useColorModeValue("gray.300", "gray.600")}
        _hover={{ borderColor: "teal.500" }}
      >
        <option value="single">Single View</option>
        <option value="split">Split View</option>
      </Select>
    </Box>
  );
};

// FeatureToggles Component
const FeatureToggles = ({ showSnippets, showLineNumbers, toggleFeature }) => {
  return (
    <Box>
      <Text fontWeight="semibold" mb={2}>
        Additional Features
      </Text>
      <HStack spacing={4}>
        <Button
          size="sm"
          colorScheme="teal"
          variant={showSnippets ? "solid" : "outline"}
          onClick={() => toggleFeature("showSnippets")}
          _hover={{ shadow: "md" }}
          transition="all 0.3s"
        >
          {showSnippets ? "Disable Snippets" : "Enable Snippets"}
        </Button>
        <Button
          size="sm"
          colorScheme="teal"
          variant={showLineNumbers ? "solid" : "outline"}
          onClick={() => toggleFeature("showLineNumbers")}
          _hover={{ shadow: "md" }}
          transition="all 0.3s"
        >
          {showLineNumbers ? "Hide Line Numbers" : "Show Line Numbers"}
        </Button>
      </HStack>
    </Box>
  );
};

export default React.memo(SettingsModal);
