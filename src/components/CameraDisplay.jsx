import React, { useEffect, useRef, useState } from "react";
import { Box, Text, useToast } from "@chakra-ui/react";
import Draggable from "react-draggable";

const CameraDisplay = ({ videoBoxSize }) => {
  const toast = useToast();
  const videoRef = useRef();
  const [isCameraActive, setIsCameraActive] = useState(true);
  useEffect(() => {
    const openCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;

        // Load the face detection model

        setIsCameraActive(true);
      } catch (err) {
        console.error("Error accessing the camera: ", err);
        setIsCameraActive(false);
        toast({
          title: "Error",
          description: "Failed to access the camera.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    openCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [toast, setIsCameraActive, videoRef]);

  return (
    <>
      {!isCameraActive && (
        <Text color="red.500" mb={4}>
          Please Turn your Camera.
        </Text>
      )}
      {isCameraActive && (
        <Draggable>
          <Box
            position="absolute"
            top="20px"
            right="20px"
            bg="gray.800"
            borderRadius="md"
            p={1}
          >
            <video
              ref={videoRef}
              autoPlay
              style={{ width: videoBoxSize, borderRadius: "8px" }}
            />
          </Box>
        </Draggable>
      )}
    </>
  );
};

export default CameraDisplay;
