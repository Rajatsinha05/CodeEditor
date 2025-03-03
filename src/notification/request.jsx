import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "../firebase/config";
import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

const messaging = getMessaging(app);

const saveTokenToDB = async (token) => {
  try {
    const response = await fetch("/api/save-fcm-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error("Failed to save token to database");
    }
    console.log("✅ Token saved to DB successfully");
  } catch (error) {
    console.error("❌ Error saving token to DB:", error);
  }
};

export const requestForToken = async () => {
  try {
    console.log("🔄 Requesting notification permission...");
    const permission = await Notification.requestPermission();

    if (!import.meta.env.VITE_FIREBASE_VAPID_KEY) {
      console.error("❌ Missing VAPID key in environment variables");
      return null;
    }

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      if (!token) {
        console.warn("⚠️ Failed to retrieve FCM token");
        return null;
      }

      console.log("✅ FCM Token:", token);

      const storedToken = localStorage.getItem("fcm_token");
      if (storedToken !== token) {
        console.log("🔄 New token detected, updating database...");
        await saveTokenToDB(token);
        localStorage.setItem("fcm_token", token);
      } else {
        console.log("✅ Token already exists in DB, skipping save");
      }
    } else {
      console.warn("⚠️ Notification permission denied");
    }
  } catch (error) {
    console.error("❌ Error retrieving FCM token:", error);
    return null;
  }
};

export const NotificationPermissionModal = ({ isOpen, onClose }) => {
  const handleAllow = async () => {
    onClose();
    await requestForToken();
  };

  const handleDeny = () => {
    console.warn("User denied notification permission");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enable Notifications</ModalHeader>
        <ModalBody>
          Get real-time updates and alerts by enabling notifications.
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleAllow}>
            Allow
          </Button>
          <Button variant="ghost" onClick={handleDeny}>
            Deny
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    try {
      onMessage(messaging, (payload) => {
        console.log("🔔 Foreground notification received:", payload);
        resolve(payload);
      });
    } catch (error) {
      console.error("❌ Error handling foreground notification:", error);
      reject(error);
    }
  });
