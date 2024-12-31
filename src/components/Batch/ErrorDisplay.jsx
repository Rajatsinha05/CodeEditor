import React from "react";
import { Box, Text } from "@chakra-ui/react";

const ErrorDisplay = ({ error }) => (
  <Box textAlign="center" py={20}>
    <Text color="red.500" fontSize="lg">
      {error}
    </Text>
  </Box>
);

export default ErrorDisplay;
