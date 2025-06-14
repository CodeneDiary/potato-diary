import PieChartComponent from "@/components/PieChartComponent";
import { emotionToGroup } from "@/utils/emotionMap";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MyPage() {
  const router = useRouter();

  const [emotionCounts, setEmotionCounts] = useState<Record<string, number>>({
    happy: 0,
    sad: 0,
    calm: 0,
    angry: 0,
    neutral: 0,
    anxious: 0,
  });

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
        if (response.ok) {
          const data = await response.json();

          // 이번 달의 일기만 필터링
          const currentMonth = dayjs().format("YYYY-MM");
          const thisMonthDiaries = data.filter((entry: any) =>
            entry.date.startsWith(currentMonth)
          );

          // content 필드 처리
          const parsed = thisMonthDiaries.map((entry: any) => ({
            ...entry,
            content: entry.content ?? entry.text ?? "",
          }));

          const counts: Record<string, number> = {
            happy: 0,
            sad: 0,
            calm: 0,
            angry: 0,
            neutral: 0,
            anxious: 0,
          };

          parsed.forEach((entry: any) => {
            const group = emotionToGroup[entry.emotion] || "neutral";
            counts[group]++;
          });

          setEmotionCounts(counts);
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
      {/* 상단 설정 아이콘 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.push("/settings")}>
          <Ionicons name="settings-outline" size={28} />
        </Pressable>
      </View>

      {/* 내용 */}
      <View style={styles.contents}>
        <Text style={styles.title}>월별 감정 분석 그래프</Text>

        <View style={{ marginTop: 20 }}>
          <PieChartComponent emotionCounts={emotionCounts} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7E0",
    justifyContent: "flex-start", // ← 달력 상단부터 보이게
    alignItems: "center",
    paddingTop: 60,
  },
  header: {
    alignItems: "flex-end",
    marginBottom: 20,
    width: 330,
  },
  contents: {
    width: 330,
    top: 15,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 24,
    fontFamily: "Cafe24Dongdong",
  },
});
