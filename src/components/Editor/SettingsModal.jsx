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

const SettingsModal = ({
  isOpen,
  onClose,
  preferences,
  setPreferences,
  theme,
  setTheme,
  fontSize,
  setFontSize,
  onLanguageChange,
}) => {
  // Define theme colors for light and dark modes
  const bg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const buttonBg = useColorModeValue("teal.400", "teal.500");
  const buttonHoverBg = useColorModeValue("teal.500", "teal.600");
  const cancelButtonBg = useColorModeValue("red.300", "red.400");
  const cancelButtonHoverBg = useColorModeValue("red.400", "red.500");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size={["sm", "md", "lg"]}
    >
      <ModalOverlay />
      <ModalContent
        bg={bg}
        borderRadius="md"
        border="1px solid"
        borderColor={borderColor}
        mx={[4, 8]} // Add responsive horizontal margin for smaller screens
      >
        <ModalHeader
          textAlign="center"
          fontSize={["lg", "xl", "2xl"]}
          fontWeight="bold"
          color={textColor}
        >
          Editor Settings
        </ModalHeader>
        <ModalCloseButton color={textColor} />
        <ModalBody>
          <VStack spacing={[4, 6]} align="stretch">
            <LanguageSelector
              language={preferences.language}
              setLanguage={onLanguageChange}
            />
            <ThemeSelector theme={theme} setTheme={setTheme} />
            <FontSizeSelector fontSize={fontSize} setFontSize={setFontSize} />
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
      </ModalContent>
    </Modal>
  );
};

const LanguageSelector = ({ language, setLanguage }) => {
  const bg = useColorModeValue("gray.100", "gray.700");
  const color = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Box>
      <Text fontWeight="semibold" mb={2} color={color}>
        Programming Language
      </Text>
      <Select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        bg={bg}
        color={color}
        borderColor={borderColor}
        _hover={{ borderColor: "teal.500" }}
        width="full"
      >
        <option value="java">Java</option>
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="python">Python</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
      </Select>
    </Box>
  );
};

const ThemeSelector = ({ theme, setTheme }) => {
  const bg = useColorModeValue("gray.100", "gray.700");
  const color = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Box>
      <Text fontWeight="semibold" mb={2} color={color}>
        Editor Theme
      </Text>
      <Select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        bg={bg}
        color={color}
        borderColor={borderColor}
        _hover={{ borderColor: "teal.500" }}
        width="full"
      >
        <option value="vs-dark">Dark Theme</option>
        <option value="vs-light">Light Theme</option>
        <option value="high-contrast">High Contrast</option>
        <option value="monokai">Monokai</option>
      </Select>
    </Box>
  );
};

const FontSizeSelector = ({ fontSize, setFontSize }) => {
  const bg = useColorModeValue("gray.100", "gray.700");
  const color = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Box>
      <Text fontWeight="semibold" mb={2} color={color}>
        Font Size
      </Text>
      <Select
        value={fontSize}
        onChange={(e) => setFontSize(parseInt(e.target.value))}
        bg={bg}
        color={color}
        borderColor={borderColor}
        _hover={{ borderColor: "teal.500" }}
        width="full"
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

const FeatureToggles = ({ showSnippets, showLineNumbers, toggleFeature }) => {
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Box>
      <Text fontWeight="semibold" mb={2} color={textColor}>
        Additional Features
      </Text>
      <HStack spacing={4} flexWrap="wrap">
        <Button
          size="sm"
          colorScheme="teal"
          variant={showSnippets ? "solid" : "outline"}
          onClick={() => toggleFeature("showSnippets")}
          _hover={{ shadow: "md" }}
          transition="all 0.3s"
          w={["full", "auto"]}
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
          w={["full", "auto"]}
        >
          {showLineNumbers ? "Hide Line Numbers" : "Show Line Numbers"}
        </Button>
      </HStack>
    </Box>
  );
};

export default React.memo(SettingsModal);
