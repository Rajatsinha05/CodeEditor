import React from "react";
import Select from "react-select";

const CustomSelect = ({ id, label, options, onChange, isMulti, styles, onInputChange }) => (
  <FormControl id={id} mt={4}>
    <FormLabel>{label}</FormLabel>
    <Select
      options={options}
      onChange={onChange}
      isMulti={isMulti}
      closeMenuOnSelect={!isMulti}
      styles={styles}
      onInputChange={onInputChange}
    />
  </FormControl>
);

export default React.memo(CustomSelect);
