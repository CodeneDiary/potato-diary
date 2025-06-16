import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

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
