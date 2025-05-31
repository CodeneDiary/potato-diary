// app/index.tsx
import Calendar from "@/components/Calendar";
import DiaryList from "@/components/DiaryList";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function CalendarPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const viewModeRef = useRef<"calendar" | "list">("calendar");

  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  useEffect(() => {
    setViewMode(viewModeRef.current);
  }, []);

  const goToTodayWrite = async () => {
    const today = dayjs().format("YYYY-MM-DD");

    try {
      const existingDiary = await AsyncStorage.getItem(`diary_${today}`);
      if (existingDiary) {
        // 이미 일기가 있으면 일기 확인 페이지로 이동
        router.push({ pathname: "/view/[date]", params: { date: today } });
      } else {
        // 없으면 일기 작성 페이지로 이동
        router.push(`/write/${today}`);
      }
    } catch (error) {
      console.error("일기 확인 중 오류:", error);
      // 오류 시 기본적으로 작성 페이지로 이동
      router.push(`/write/${today}`);
    }
  };

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
              setViewMode(viewMode === "calendar" ? "list" : "calendar")
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
      <View style={styles.buttonContainer}>
        <Pressable style={styles.fab} onPress={goToTodayWrite}>
          <Ionicons name="add" size={32} color="#FFF" />
        </Pressable>
      </View>
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
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    right: 20,
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#63411F",
    alignItems: "center",
    justifyContent: "center",
  },
});
