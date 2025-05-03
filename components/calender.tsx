// components/PotatoCalendar.tsx
import dayjs from "dayjs";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const calendar = () => {
  const now = dayjs();
  const year = now.year();
  const month = now.month() + 1; // 1~12

  const startDay = dayjs(`${year}-${month}-01`).day(); // 0~6
  const daysInMonth = dayjs(`${year}-${month}`).daysInMonth();

  const dates = Array.from({ length: startDay + daysInMonth }, (_, i) => {
    if (i < startDay) return null;
    return i - startDay + 1;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`${year}년 ${month}월`}</Text>
      <View style={styles.dayHeader}>
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <Text style={styles.dayLabel} key={d}>
            {d}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {dates.map((date, index) => (
          <View key={index} style={styles.cell}>
            {date ? (
              <>
                <Text style={styles.dateText}>{date}</Text>
                <Image
                  source={require("../assets/images/day.png")}
                  style={styles.potato}
                />
              </>
            ) : (
              <View style={styles.empty} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default calendar;

const styles = StyleSheet.create({
  container: {
    width: 330,
    paddingTop: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF7E0",
  },
  title: {
    fontSize: 20,
    marginBottom: 40,
  },
  dayHeader: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  dayLabel: {
    width: "14.28%",
    textAlign: "center",
    fontWeight: "bold",
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
    fontSize: 14,
    marginBottom: 2,
    height: 24,
  },
  potato: {
    width: 40,
    height: 40,
  },
  empty: {
    height: 70,
  },
});
