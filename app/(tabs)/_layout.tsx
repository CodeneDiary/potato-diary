import { listenForTokenChanges } from "@/utils/firebaseTokenListener";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs } from "expo-router";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";

export default function TabsLayout() {
  useEffect(() => {
    listenForTokenChanges();

    const refreshToken = async () => {
      const user = getAuth().currentUser;
      if (user) {
        try {
          const token = await user.getIdToken(true);
          await AsyncStorage.setItem("jwtToken", token);
          console.log("🔄 Firebase JWT 재발급 완료");
        } catch (error) {
          console.error("토큰 재발급 실패:", error);
        }
      }
    };

    const interval = setInterval(refreshToken, 50 * 60 * 1000); // 50분마다

    return () => clearInterval(interval);
  }, []);
  return (
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
        name="calendar"
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
  );
}
