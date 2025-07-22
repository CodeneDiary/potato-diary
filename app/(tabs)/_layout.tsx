import { listenForTokenChanges } from "@/utils/firebaseTokenListener";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect } from "react";

export default function TabsLayout() {
  useEffect(() => {
    listenForTokenChanges();
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
