import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { onIdTokenChanged } from "firebase/auth";
import { getFirebaseAuth } from "../config/firebaseConfig";
const auth = getFirebaseAuth();
export const listenForTokenChanges = () => {
  onIdTokenChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken(); // 갱신된 토큰
      await AsyncStorage.setItem("jwtToken", token);
    } else {
      await AsyncStorage.removeItem("jwtToken");
      router.replace("/");
    }
  });
};
