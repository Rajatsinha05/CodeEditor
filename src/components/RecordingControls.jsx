import React from "react";
import { Button, HStack, Text } from "@chakra-ui/react";

const RecordingControls = ({ startRecording, stopCameraAccess, isRecording, isCameraActive }) => {
  return (
    <HStack spacing={4} mt={4}>
      <Button
        onClick={startRecording}
        isDisabled={isRecording || !isCameraActive}
        colorScheme="green"
      >
        Start Recording
      </Button>
      <Button onClick={stopCameraAccess} colorScheme="red">
        Stop Camera Access
      </Button>
    </HStack>
  );
};

export default RecordingControls;
