import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

// 테마 관련 색상 상수 정의
const colors = {
  background: "#FFF7E0",
  tabBar: "#F5E3B3",
  primary: "#63411F",
  inactive: "#999999",
};

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          height: 90, // 탭 바 높이 설정
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
  );
}
