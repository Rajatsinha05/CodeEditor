import React from "react";
import ReactSelect from "react-select";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Languages } from "../data/Modules";


const ModuleSelector = ({ selectedModules, setSelectedModules, customSelectStyles }) => {
  const handleModuleSelect = (selectedOptions) => {
    setSelectedModules(selectedOptions.map((option) => option.value));
  };

  return (
    <FormControl id="modules" isRequired>
      <FormLabel>Select Modules</FormLabel>
      <ReactSelect
        options={Languages().map((language) => ({
          label: language.label,
          value: language.value,
        }))}
        isMulti
        closeMenuOnSelect={false}
        styles={customSelectStyles}
        onChange={handleModuleSelect}
        value={Languages().filter((language) =>
          selectedModules.includes(language.value)
        )}
        placeholder="Search and select modules"
      />
    </FormControl>
  );
};

export default ModuleSelector;
