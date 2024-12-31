import { useEffect, useRef, useState } from "react";

const useTabActivityTracker = () => {
  const [inactiveTime, setInactiveTime] = useState(0);
  const [tabChangeCount, setTabChangeCount] = useState(0);
  const startTimeRef = useRef(null); // Tracks when inactivity starts

  // Format time as minutes and seconds
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Increment tab change count
        setTabChangeCount((prevCount) => prevCount + 1);

        // Record the start time of inactivity
        startTimeRef.current = Date.now();
      } else {
        // Calculate and add the inactive duration
        if (startTimeRef.current) {
          const inactiveDuration = Math.floor(
            (Date.now() - startTimeRef.current) / 1000
          );
          setInactiveTime((prevTime) => prevTime + inactiveDuration);
          startTimeRef.current = null; // Reset start time
        }
      }
    };

    // Add event listener for visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // Cleanup on component unmount
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // Calculate final inactive time if the component unmounts while the tab is inactive
      if (document.hidden && startTimeRef.current) {
        const inactiveDuration = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        setInactiveTime((prevTime) => prevTime + inactiveDuration);
      }
    };
  }, []);

  return { inactiveTime: formatTime(inactiveTime), tabChangeCount };
};

export default useTabActivityTracker;
