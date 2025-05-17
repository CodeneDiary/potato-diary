// app/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  const [fontsLoaded] = useFonts({
    Cafe24Dongdong: require("../../assets/fonts/Cafe24Dongdong.ttf"),
  });

  useEffect(() => {
    async function loadAssets() {
      try {
        await Asset.loadAsync([
          require("@/assets/images/emotion-happy.png"),
          require("@/assets/images/emotion-calm.png"),
          require("@/assets/images/emotion-sad.png"),
          require("@/assets/images/emotion-angry.png"),
          require("@/assets/images/emotion-neutral.png"),
          require("@/assets/images/day.png"),
        ]);
      } catch (e) {
        console.warn("이미지 로딩 오류:", e);
      } finally {
        setAssetsLoaded(true);
      }
    }
    loadAssets();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && assetsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, assetsLoaded]);

  if (!fontsLoaded || !assetsLoaded) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#F5E3B3",
            borderTopWidth: 0,
            height: 90,
            paddingTop: 10,
          },
          tabBarActiveTintColor: "#63411F",
          tabBarInactiveTintColor: "#999999",
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="mypage"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
