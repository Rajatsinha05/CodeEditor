import React from "react";
import { Button, HStack } from "@chakra-ui/react";

const ControlButtons = ({ isRecording, isCameraOn, onStartStopRecording, onToggleCamera }) => {
  return (
    <HStack spacing={4} mt={4}>
      <Button onClick={onStartStopRecording} colorScheme={isRecording ? "red" : "green"}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      <Button onClick={onToggleCamera} colorScheme={isCameraOn ? "red" : "green"}>
        {isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
      </Button>
    </HStack>
  );
};

export default ControlButtons;
