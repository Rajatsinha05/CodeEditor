import React from "react";
import { Text } from "@chakra-ui/react";

const InfoDisplay = ({ inactiveTime, tabChangeCount }) => {
  return (
    <>
      <Text mt={4}>Inactive Time: {inactiveTime} seconds</Text>
      <Text mt={4}>Tab Changes: {tabChangeCount}</Text>
    </>
  );
};

export default InfoDisplay;
