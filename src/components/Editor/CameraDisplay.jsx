import React, { useEffect, useRef, useState } from "react";
import { Box, Text, useToast, HStack, Icon } from "@chakra-ui/react";
import { ViewOffIcon } from "@chakra-ui/icons";
import Draggable from "react-draggable";
import * as faceapi from "face-api.js";

import { showToast } from "../../utils/toastUtils";

const CameraDisplay = ({ videoBoxSize }) => {
  const toast = useToast();
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const toastRef = useRef(false); // Track toast visibility to prevent duplicates

  const initializeFaceApi = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
  };

  useEffect(() => {
    const openCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        await initializeFaceApi();
        setIsCameraActive(true);
        toastRef.current = false; // Reset toast visibility if the camera works
      } catch {
        setIsCameraActive(false);
        if (!toastRef.current) {
          showToast(toast, "Failed to access the camera.", "error");
          toastRef.current = true; // Prevent multiple toasts
        }
      }
    };

    openCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [toast]);

  return (
    <>
      {!isCameraActive && (
        <HStack color="red.500" mb={4}>
          <Icon as={ViewOffIcon} boxSize={6} />
          <Text>Please Turn on your Camera.....</Text>
        </HStack>
      )}
      {isCameraActive && (
        <Draggable>
          <Box position="absolute" top="20px" right="20px" bg="gray.800" p={1}>
            <video
              ref={videoRef}
              autoPlay
              style={{
                width: videoBoxSize || "100px",
                height: videoBoxSize || "100px",
                borderRadius: "8px",
              }}
            />
          </Box>
        </Draggable>
      )}
    </>
  );
};

export default React.memo(CameraDisplay);
