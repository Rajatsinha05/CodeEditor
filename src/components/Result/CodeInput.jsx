import React from 'react';
import { Input } from '@chakra-ui/react';

const CodeInput = ({ input, handleInputChange, handleKeyDown }) => (
  <Input
    placeholder="Enter input here..."
    value={input}
    onChange={handleInputChange}
    onKeyDown={handleKeyDown}
    mt={4}
    mb={4}
    bg="gray.700"
    color="gray.100"
    borderColor="gray.600"
  />
);

export default CodeInput;
