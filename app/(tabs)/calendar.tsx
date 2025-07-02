// app/index.tsx
import Calendar from "@/components/Calendar";
import DiaryList from "@/components/DiaryList";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

type DiaryType = {
  id: number;
  date: string;
  content: string;
  emotion: string;
};

export default function CalendarPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const viewModeRef = useRef<"calendar" | "list">("calendar");

  const [searchMode, setSearchMode] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  useEffect(() => {
    setViewMode(viewModeRef.current);
  }, []);

  const [diaryList, setDiaryList] = useState<DiaryType[]>([]);

  const goToTodayWrite = () => {
    const today = dayjs().format("YYYY-MM-DD");
    const todayDiary = diaryList.find((entry) => entry.date === today);

    if (todayDiary) {
      router.push({ pathname: "/view/[date]", params: { date: today } });
    } else {
      router.push(`/write/${today}`);
    }
  };

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        const response = await fetch(
          "https://gamja-friend.onrender.com/diary/list",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (response.status === 401) {
          console.warn(
            "⛔️ 토큰이 만료되었거나 유효하지 않음. 로그인 페이지로 이동."
          );
          await AsyncStorage.removeItem("jwtToken");
          router.replace("/");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          console.log("📘 받아온 일기 데이터:", data);
          const parsed = data.map((entry: any) => ({
            id: entry.id,
            date: entry.date,
            content: entry.content ?? entry.text ?? "",
            emotion: entry.emotion ?? "neutral",
          }));
          setDiaryList(parsed);
        } else {
          const errorText = await response.text();
          console.error("일기 목록 불러오기 실패:", errorText);
        }
      } catch (error) {
        console.error("일기 목록 요청 중 오류 발생", error);
      }
    };
    fetchDiaries();
  }, []);

  return (
    <View style={styles.container}>
      {/* 헤더 아이콘 */}
      <View style={styles.header}>
        {searchMode ? (
          <View style={styles.searchBar}>
            <TextInput
              value={searchKeyword}
              onChangeText={setSearchKeyword}
              placeholder="검색어를 입력하세요"
              style={styles.searchInput}
              autoFocus
              onSubmitEditing={() => {
                console.log("검색 실행:", searchKeyword);
                // TODO: API 요청 예정
              }}
            />
            <Pressable
              onPress={() => {
                setSearchMode(false);
                setSearchKeyword("");
              }}
            >
              <Ionicons
                name="close-circle"
                size={22}
                color="#63411F"
                style={{ marginRight: 15 }}
              />
            </Pressable>
          </View>
        ) : (
          <View style={styles.iconGroup}>
            <Pressable
              onPress={() => setSearchMode(true)}
              style={{ marginLeft: 20 }}
            >
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
        )}
      </View>
      {/* 메인 화면 */}
      {viewMode === "calendar" ? (
        <Calendar diaryList={diaryList} />
      ) : (
        <DiaryList diaryList={diaryList} />
      )}
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
  searchInput: {
    fontSize: 16,
    width: 310,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 40,
    borderWidth: 1.5,
    borderColor: "#63411F",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
