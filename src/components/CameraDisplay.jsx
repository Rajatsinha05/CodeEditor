import React, { useRef, useEffect } from "react";
import Draggable from "react-draggable";

const CameraDisplay = () => {
  const videoRef = useRef();

  useEffect(() => {
    const openCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing the camera: ", err);
      }
    };

    openCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Draggable>
      <div style={{ position: "absolute", bottom: "20px", right: "20px", background: "gray", borderRadius: "8px", padding: "8px" }}>
        <video ref={videoRef} autoPlay style={{ width: "150px", borderRadius: "8px" }} />
      </div>
    </Draggable>
  );
};

export default CameraDisplay;
