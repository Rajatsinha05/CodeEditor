importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDtiwdFNcpVHseoS6440BlR9lrQNXJXFb8",
  authDomain: "code-3d102.firebaseapp.com",
  projectId: "code-3d102",
  storageBucket: "code-3d102.appspot.com",
  messagingSenderId: "987312792099",
  appId: "1:987312792099:web:9b09b7599db7af838c4796",
  measurementId: "G-8KJB7FGE4H",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/favicon.ico",
  });
});
