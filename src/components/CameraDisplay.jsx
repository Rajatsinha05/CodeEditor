import React from "react";
import Draggable from "react-draggable";
import { Box, Text } from "@chakra-ui/react";

const CameraDisplay = ({ videoRef, isCameraActive }) => {
  return (
    <Draggable>
      <Box
        position="absolute"
        top="20px"
        right="20px"
        bg="gray.800"
        borderRadius="md"
        p={1}
      >
        {isCameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            style={{ width: "150px", borderRadius: "8px" }}
          />
        ) : (
          <Text color="red.500" mb={4}>
            Please Turn on your Camera.
          </Text>
        )}
      </Box>
    </Draggable>
  );
};

export default CameraDisplay;
