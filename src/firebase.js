import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyDHvC6J2Key0rnoqfspVOHs6tZp1oEpsaU",
  authDomain: "lease-lens-71d81.firebaseapp.com",
  projectId: "lease-lens-71d81",
  storageBucket: "lease-lens-71d81.firebasestorage.app",
  messagingSenderId: "458081951992",
  appId: "1:458081951992:web:cf63653ec4b24315f1db0d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Google (Gmail)
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Microsoft (Outlook)
export const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({ prompt: 'select_account' });