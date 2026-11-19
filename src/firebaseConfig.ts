import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getMessaging, onMessage, Messaging } from 'firebase/messaging';

const useFCM = process.env.USE_FCM === 'true';

const firebaseConfig = {
    apiKey: "AIzaSyCY5EdT9SUR97waNsxOtQjxRI1zaSCbrPY",
    authDomain: "sin-alitas-app.firebaseapp.com",
    projectId: "sin-alitas-app",
    storageBucket: "sin-alitas-app.appspot.com",
    messagingSenderId: "138252749885",
    appId: "1:138252749885:web:cc2edf56a2e4f54234ee54",
    measurementId: "G-1FT532NS7L"
  };
  let messaging: Messaging | null = null;
  let auth = null;
  let listenToMessages: (() => Promise<any>) | null = null;
  
  if (useFCM) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    messaging = getMessaging(app);
  
    // Función de escucha de mensajes
    listenToMessages = () =>
      new Promise(resolve => {
        onMessage(messaging!, payload => {
          resolve(payload);
        });
      });
  }
  
  // Exporta las instancias de messaging y auth (pueden ser nulas si useFCM es falso)
  export { messaging, auth, listenToMessages };


  
  