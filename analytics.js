import ReactGA from "react-ga4";

const TRACKING_ID = "G-0Y29239ZGDß"; // Replace with your Google Analytics Measurement ID
ReactGA.initialize(TRACKING_ID);

// Function to track page views
export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Function to track custom events
export const trackEvent = (category, action, label = "", value = 0) => {
  ReactGA.event({ category, action, label, value });
};

// Function to track user information (if applicable)
export const trackUser = (userId) => {
  ReactGA.set({ user_id: userId });
};
