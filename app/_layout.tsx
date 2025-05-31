import AppLoading from "expo-app-loading"; // expo-app-loading 설치 필요
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import React, { useState } from "react";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  const loadAssets = async () => {
    // 폰트 로드
    await Font.loadAsync({
      Cafe24Dongdong: require("@/assets/fonts/Cafe24Dongdong.ttf"),
      // 추가 폰트 있으면 여기에
    });

    // 이미지 캐싱 (예: 감자 이미지)
    await Asset.loadAsync([
      require("@/assets/images/emotion-happy.png"),
      require("@/assets/images/emotion-calm.png"),
      require("@/assets/images/emotion-sad.png"),
      require("@/assets/images/emotion-angry.png"),
      require("@/assets/images/emotion-neutral.png"),
      require("@/assets/images/day.png"),
    ]);
  };

  if (!isReady) {
    return (
      <AppLoading
        startAsync={loadAssets}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
