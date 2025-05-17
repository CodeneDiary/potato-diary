import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import MonthYearPicker from "../components/MonthYearPicker";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();

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

    try {
      const diary = await AsyncStorage.getItem(`diary-${dateKey}`);
      if (diary) {
        router.push(`/view/${dateKey}`);
      } else {
        router.push(`/write/${dateKey}`);
      }
    } catch (e) {
      console.error("Storage error:", e);
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
        {dates.map((date, index) => (
          <View key={index} style={styles.cell}>
            {date ? (
              <Pressable onPress={() => onPressDate(date)}>
                <Text style={styles.dateText}>{date}</Text>
                <Image
                  source={require("../assets/images/day.png")}
                  style={styles.potato}
                />
              </Pressable>
            ) : (
              <View style={styles.empty} />
            )}
          </View>
        ))}
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
