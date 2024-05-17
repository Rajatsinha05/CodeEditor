import React from "react";
import { HStack } from "@chakra-ui/react";
import LanguageSelector from "./LanguageSelector";
import CustomSelect from "./CustomSelect";

const Controls = ({
  language,
  onSelect,
  theme,
  handleThemeChange,
  fontSize,
  handleFontSizeChange,
}) => {
  return (
    <HStack>
      <LanguageSelector language={language} onSelect={onSelect} />
      <CustomSelect
        value={theme}
        onChange={handleThemeChange}
        options={[
          { value: "vs-dark", label: "Dark Theme" },
          { value: "vs-light", label: "Light Theme" },
        ]}
        width="150px"
        mr={4}
      />
      <CustomSelect
        value={fontSize}
        onChange={handleFontSizeChange}
        options={[
          { value: 14, label: "14px" },
          { value: 16, label: "16px" },
          { value: 18, label: "18px" },
        ]}
        width="120px"
      />
    </HStack>
  );
};

export default Controls;
