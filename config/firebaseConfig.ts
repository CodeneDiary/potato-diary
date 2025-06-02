import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAwbE02eqzGKIm1uv8KqSoPsCVwSf6_uHw",
  authDomain: "gamja-friend.firebaseapp.com",
  projectId: "gamja-friend",
  storageBucket: "gamja-friend.firebasestorage.app",
  messagingSenderId: "246243944057",
  appId: "1:246243944057:web:1d315d31d6ce72c19b16a8",
  measurementId: "G-X1KZLS5CJM",
};

const app = initializeApp(firebaseConfig);
export const getFirebaseAuth = () => {
  return getAuth(app); // 호출을 함수로 지연
};
