import React from "react";
import { FormControl, FormLabel, Input, Textarea, Select as ChakraSelect } from "@chakra-ui/react";

const InputField = ({ id, label, type = "text", value, onChange, bg, color, borderColor, placeholderColor }) => (
  <FormControl id={id} mt={4}>
    <FormLabel color={color}>{label}</FormLabel>
    <Input
      type={type}
      name={id}
      value={value}
      onChange={onChange}
      bg={bg}
      color={color}
      border={`1px solid ${borderColor}`}
      _placeholder={{ color: placeholderColor }}
    />
  </FormControl>
);

const TextareaField = ({ id, label, value, onChange, bg, color, borderColor, placeholderColor }) => (
  <FormControl id={id} mt={4}>
    <FormLabel color={color}>{label}</FormLabel>
    <Textarea
      name={id}
      value={value}
      onChange={onChange}
      bg={bg}
      color={color}
      border={`1px solid ${borderColor}`}
      _placeholder={{ color: placeholderColor }}
    />
  </FormControl>
);

const SelectField = ({ id, label, options, value, onChange, styles }) => (
  <FormControl id={id} mt={4}>
    <FormLabel>{label}</FormLabel>
    <ChakraSelect
      options={options}
      value={options.find(option => option.value === value)}
      onChange={onChange}
      styles={styles}
    />
  </FormControl>
);

export { InputField, TextareaField, SelectField };
