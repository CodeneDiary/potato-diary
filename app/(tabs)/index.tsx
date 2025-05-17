// app/index.tsx
import Calendar from "@/components/Calendar";
import DiaryList from "@/components/DiaryList";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  return (
    <View style={styles.container}>
      {/* 헤더 아이콘 */}
      <View style={styles.header}>
        <View style={styles.iconGroup}>
          <Pressable onPress={() => console.log("검색")}>
            <Ionicons name="search" size={24} color="#63411F" />
          </Pressable>
          <Pressable
            onPress={() =>
              setViewMode((prev) => (prev === "calendar" ? "list" : "calendar"))
            }
            style={{ marginLeft: 20 }}
          >
            <Ionicons
              name={viewMode === "calendar" ? "list" : "calendar-outline"}
              size={24}
              color="#63411F"
            />
          </Pressable>
        </View>
      </View>

      {/* 메인 화면 */}
      {viewMode === "calendar" ? <Calendar /> : <DiaryList />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7E0",
    alignItems: "center",
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "90%",
    marginBottom: 10,
  },
  iconGroup: {
    flexDirection: "row",
  },
});
