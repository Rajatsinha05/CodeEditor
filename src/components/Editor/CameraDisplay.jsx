import React, { useEffect, useRef, useState } from "react";
import { Box, Text, useToast, HStack, Icon } from "@chakra-ui/react";
import { ViewOffIcon } from "@chakra-ui/icons";
import Draggable from "react-draggable";
import * as faceapi from "face-api.js";
import * as tf from "@tensorflow/tfjs";

const CameraDisplay = ({ videoBoxSize }) => {
  const toast = useToast();
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isFaceDetected, setIsFaceDetected] = useState(true);
  const detectionInterval = useRef(null);
  const noFaceTimeout = useRef(null);
  const cameraAlertShown = useRef(false);
  const modelsInitialized = useRef(false);

  const FACE_DETECTION_TIME_LIMIT = 10000;

  const initializeFaceApi = async () => {
    if (!modelsInitialized.current) {
      if (tf.getBackend() !== "webgl") {
        await tf.setBackend("webgl");
      }
      await tf.ready();

      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        modelsInitialized.current = true;
        startFaceDetection();
      } catch (error) {
        toast({
          description: "Failed to load face detection models.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
          containerStyle: {
            maxWidth: "200px",
            padding: "5px",
          },
        });
      }
    }
  };

  const startFaceDetection = () => {
    detectionInterval.current = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const detections = await faceapi.detectAllFaces(videoRef.current);

        if (detections.length === 0) {
          setIsFaceDetected(false);

          if (!noFaceTimeout.current) {
            noFaceTimeout.current = setTimeout(() => {
              toast({
                description: "No Face Detected",
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "top",
                containerStyle: {
                  maxWidth: "180px",
                  padding: "5px",
                },
              });
            }, FACE_DETECTION_TIME_LIMIT);
          }
        } else {
          setIsFaceDetected(true);

          if (noFaceTimeout.current) {
            clearTimeout(noFaceTimeout.current);
            noFaceTimeout.current = null;
          }
        }
      }
    }, 1000);
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
        cameraAlertShown.current = false;
      } catch (err) {
        setIsCameraActive(false);

        if (!cameraAlertShown.current) {
          toast({
            description: "Failed to access the camera.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
            containerStyle: {
              maxWidth: "200px",
              padding: "5px",
            },
          });
          cameraAlertShown.current = true;
        }
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
        <HStack color="red.500" mb={4}>
          <Icon as={ViewOffIcon} boxSize={6} />
          <Text>Please Turn on your Camera.....</Text>
        </HStack>
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