import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import MonthYearPicker from "../components/MonthYearPicker";

// ✅ 감정별 이미지 매핑
const emotionImages: Record<string, any> = {
  happy: require("../assets/images/emotion-happy.png"),
  sad: require("../assets/images/emotion-sad.png"),
  calm: require("../assets/images/emotion-calm.png"),
  neutral: require("../assets/images/emotion-neutral.png"),
  angry: require("../assets/images/emotion-angry.png"),
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [showPicker, setShowPicker] = useState(false);
  const [fetchedDiaries, setFetchedDiaries] = useState<
    Record<string, { emotion: string }>
  >({});
  const router = useRouter();

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        const response = await fetch(
          "https://gamja-friend.onrender.com/diary/list",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("받아온 일기 데이터 전체:", data);
          // data 배열 -> { "YYYY-MM-DD": { emotion: "happy" } } 형태로 변환
          const diariesByDate: Record<string, { emotion: string }> = {};
          data.forEach((entry: any) => {
            const dateKey = dayjs(entry.date).format("YYYY-MM-DD");
            diariesByDate[dateKey] = { emotion: entry.emotion.toLowerCase() };
          });
          setFetchedDiaries(diariesByDate);
        } else {
          console.error(`일기 목록 불러오기 실패. Status: ${response.status}`);
          const errorText = await response.text();
          console.error("에러 메시지:", errorText);
        }
      } catch (error) {
        console.error("일기 목록 요청 중 오류 발생", error);
      }
    };

    fetchDiaries();
  }, []);

  const year = currentDate.year();
  const month = currentDate.month() + 1;

  const startDay = currentDate.startOf("month").day();
  const daysInMonth = currentDate.daysInMonth();

  const dates = Array.from({ length: startDay + daysInMonth }, (_, i) => {
    if (i < startDay) return null;
    return i - startDay + 1;
  });

  const onPressDate = async (date: number) => {
    const dateKey = dayjs()
      .year(year)
      .month(month - 1)
      .date(date)
      .format("YYYY-MM-DD");

    const diary = fetchedDiaries[dateKey];
    if (diary) {
      router.push(`/view/${dateKey}`);
    } else {
      router.push(`/write/${dateKey}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => setShowPicker(true)}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Text style={styles.title}>{`${year}년 ${month}월`}</Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color="#63411F"
            style={{ marginLeft: 4 }}
          />
        </Pressable>
      </View>

      {/* 요일 헤더 */}
      <View style={styles.dayHeader}>
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <Text style={styles.dayLabel} key={d}>
            {d}
          </Text>
        ))}
      </View>

      {/* 날짜 그리드 */}
      <View style={styles.grid}>
        {dates.map((date, index) => {
          const dateKey = dayjs()
            .year(year)
            .month(month - 1)
            .date(date ?? 0)
            .format("YYYY-MM-DD");
          const diary = fetchedDiaries[dateKey];
          const emotion = diary?.emotion;
          const imageSource = emotion
            ? emotionImages[emotion]
            : require("../assets/images/day.png");

          return (
            <View key={index} style={styles.cell}>
              {date ? (
                <Pressable onPress={() => onPressDate(date)}>
                  <Text style={styles.dateText}>{date}</Text>
                  <Image source={imageSource} style={styles.potato} />
                </Pressable>
              ) : (
                <View style={styles.empty} />
              )}
            </View>
          );
        })}
      </View>

      {/* 연/월 선택 모달 */}
      <MonthYearPicker
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        initialYear={year}
        onSelect={(selectedYear, selectedMonth) => {
          const newDate = dayjs()
            .year(selectedYear)
            .month(selectedMonth - 1);
          setCurrentDate(newDate);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 330,
    paddingTop: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF7E0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    alignItems: "center",
    fontFamily: "Cafe24Dongdong",
  },
  dayHeader: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  dayLabel: {
    width: "14.28%",
    textAlign: "center",
    fontFamily: "Cafe24Dongdong",
    fontSize: 22,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  cell: {
    width: "14.28%",
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  dateText: {
    fontSize: 15,
    marginBottom: 2,
    height: 24,
    fontFamily: "Cafe24Dongdong",
    textAlign: "center",
  },
  potato: {
    width: 40,
    height: 40,
  },
  empty: {
    height: 70,
  },
});
