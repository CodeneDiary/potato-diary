import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { View } from "react-native"; // ✅ 추가

// 테마 색상 정의
const colors = {
  background: "#FFF7E0",
  tabBar: "#F5E3B3",
  primary: "#63411F",
  inactive: "#999999",
};

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Cafe24Dongdong: require("../assets/fonts/Cafe24Dongdong.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            height: 90,
            paddingTop: 10,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.inactive,
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
