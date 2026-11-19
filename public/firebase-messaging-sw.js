importScripts("https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyCY5EdT9SUR97waNsxOtQjxRI1zaSCbrPY",
  authDomain: "sin-alitas-app.firebaseapp.com",
  projectId: "sin-alitas-app",
  storageBucket: "sin-alitas-app.appspot.com",
  messagingSenderId: "138252749885",
  appId: "1:138252749885:web:cc2edf56a2e4f54234ee54",
  measurementId: "G-1FT532NS7L"
};
// const urlParams = new URLSearchParams(self.location.search);
// const useFCM = urlParams.get('useFCM');

// if (useFCM === 'true') {

    firebase.initializeApp(firebaseConfig);
    // const messaging = firebase.messaging(app);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage(payload=>{
        console.log('recibiste mensaje ', payload);
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: '/assets/images/logo_1.png'
        };

        return self.registration.showNotification(
            notificationTitle,
            notificationOptions
        )
    })
// }