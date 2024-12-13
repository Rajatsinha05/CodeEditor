import React from "react";
import { Box, Spinner, Text } from "@chakra-ui/react";

const Loader = () => (
  <Box textAlign="center" py={20}>
    <Spinner size="xl" color="teal.500" />
    <Text fontSize="lg" color="gray.500" mt={4}>
      Loading batches...
    </Text>
  </Box>
);

export default Loader;
