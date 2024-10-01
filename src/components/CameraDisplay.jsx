import React, { useEffect, useRef, useState } from "react";
import { Box, Text, useToast } from "@chakra-ui/react";
import Draggable from "react-draggable";
import * as faceapi from "face-api.js";

const CameraDisplay = ({ videoBoxSize }) => {
  const toast = useToast();
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isFaceDetected, setIsFaceDetected] = useState(true);
  const detectionInterval = useRef(null);
  const noFaceTimeout = useRef(null);

  const FACE_DETECTION_TIME_LIMIT = 10000; // 10 seconds

  // Load face detection models
  const loadModels = async () => {
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      startFaceDetection();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load face detection models.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Start face detection
  const startFaceDetection = () => {
    detectionInterval.current = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const detections = await faceapi.detectAllFaces(videoRef.current);

        if (detections.length === 0) {
          setIsFaceDetected(false);

          // Start the no-face timer if it isn't already running
          if (!noFaceTimeout.current) {
            noFaceTimeout.current = setTimeout(() => {
              toast({
                title: "No Face Detected",
                description:
                  "Your face has not been visible for 10 seconds. Please adjust your camera.",
                status: "warning",
                duration: 2000,
                isClosable: true,
              });
            }, FACE_DETECTION_TIME_LIMIT);
          }
        } else {
          setIsFaceDetected(true);

          // Reset the no-face timer if a face is detected
          if (noFaceTimeout.current) {
            clearTimeout(noFaceTimeout.current);
            noFaceTimeout.current = null;
          }
        }
      }
    }, 1000); // Detect every second
  };

  useEffect(() => {
    const openCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;

        // Load face detection models after camera is accessed
        await loadModels();

        setIsCameraActive(true);
      } catch (err) {
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
      clearInterval(detectionInterval.current);
      clearTimeout(noFaceTimeout.current);
    };
  }, [toast]);

  return (
    <>
      {!isCameraActive && (
        <Text color="red.500" mb={4}>
          Please Turn on your Camera.
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
