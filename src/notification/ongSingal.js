export function initOneSignal() {
  if (!("serviceWorker" in navigator)) {
    console.error("❌ Service workers are not supported in this browser.");
    return;
  }

  console.log("🚀 Initializing OneSignal...");
  window.OneSignal = window.OneSignal || [];

  OneSignal.push(async () => {
    try {
      await OneSignal.init({
        appId: "fc53f7ed-f783-4cfc-8561-e1b1f0122681",
        safari_web_id:
          "web.onesignal.auto.69a0d04c-4cfa-4f80-8d34-652264ce8748",
        notifyButton: { enable: true },
        serviceWorkerPath: "/OneSignalSDKWorker.js",
        serviceWorkerUpdaterPath: "/OneSignalSDKUpdaterWorker.js",
      });

      console.log("✅ OneSignal initialized successfully!");

      // Check subscription status
      const isSubscribed = await OneSignal.isPushNotificationsEnabled();
      console.log(
        "🔔 Subscription status:",
        isSubscribed ? "Subscribed" : "Not Subscribed"
      );

      if (!isSubscribed) {
        console.log("🔄 Attempting to subscribe the user...");
        await OneSignal.registerForPushNotifications();
      }

      // Get & log the user's Player ID (if available)
      const playerId = await OneSignal.getUserId();
      if (playerId) {
        console.log("✅ User's OneSignal Player ID:", playerId);
      } else {
        console.log(
          "⏳ Player ID not available yet. Waiting for subscription..."
        );
      }

      // Handle subscription changes
      OneSignal.on("subscriptionChange", async (isSubscribed) => {
        if (isSubscribed) {
          const newPlayerId = await OneSignal.getUserId();
          console.log("✅ User subscribed! New Player ID:", newPlayerId);
        } else {
          console.log("❌ User has unsubscribed.");
        }
      });
    } catch (error) {
      console.error("❌ OneSignal initialization failed:", error);
    }
  });

  // Register Service Worker
  navigator.serviceWorker
    .register("/OneSignalSDKWorker.js")
    .then((registration) => {
      console.log("📌 Service Worker Registered:", registration);
    })
    .catch((error) => {
      console.error("❌ Service Worker registration failed:", error);
    });
}
