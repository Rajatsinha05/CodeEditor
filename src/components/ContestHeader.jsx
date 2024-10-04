import React from "react";
import { Flex, Text } from "@chakra-ui/react";

const ContestHeader = ({ contest, colorMode }) => (
  <Flex justify="space-between" align="center" mb={6}>
    <Text fontSize="3xl" fontWeight="bold" color={colorMode === "light" ? "teal.600" : "teal.300"}>
      {contest?.title}
    </Text>
  </Flex>
);

export default ContestHeader;
