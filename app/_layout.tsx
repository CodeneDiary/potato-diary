import { Asset } from "expo-asset";
import * as Device from "expo-device";
import * as Font from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { getApps, initializeApp } from "firebase/app";
import { getAuth, onIdTokenChanged } from "firebase/auth";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
    };

    const app =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

    const auth = getAuth(app);
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        console.log("🔐 Refreshed token:", token);
        // 여기서 token을 상태에 저장하거나 API 호출 시 헤더에 사용 가능
      } else {
        console.log("❌ 사용자 인증 안 됨");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        if (newStatus !== "granted") {
          console.log("❌ 알림 권한 거부됨");
        } else {
          console.log("✅ 알림 권한 허용됨");
        }
      } else {
        console.log("✅ 기존에 알림 권한 허용됨");
      }
    };

    if (Device.isDevice) {
      requestNotificationPermission();
    } else {
      console.log("❗ 알림은 실제 디바이스에서만 작동합니다.");
    }
  }, []);

  useEffect(() => {
    async function loadAssets() {
      try {
        await Font.loadAsync({
          Cafe24Dongdong: require("@/assets/fonts/Cafe24Dongdong.ttf"),
          // 추가 폰트
        });
        await Asset.loadAsync([
          require("@/assets/images/emotion-happy.png"),
          require("@/assets/images/emotion-calm.png"),
          require("@/assets/images/emotion-sad.png"),
          require("@/assets/images/emotion-angry.png"),
          require("@/assets/images/emotion-neutral.png"),
          require("@/assets/images/emotion-anxious.png"),
          require("@/assets/images/day.png"),
        ]);
      } catch (e) {
        console.warn("자산 로드 오류:", e);
      } finally {
        setIsReady(true);
      }
    }

    loadAssets();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null; // 로딩 중 화면 숨김
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7E0",
  },
});
