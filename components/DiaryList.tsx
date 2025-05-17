import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { EmotionType, emotionImages } from "../constants/emotionImages";
import MonthYearPicker from "./MonthYearPicker";

export default function DiaryList() {
  const router = useRouter();
  const [diaries, setDiaries] = useState<
    { date: string; content: string; emotion: EmotionType }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      const allKeys = await AsyncStorage.getAllKeys();
      const diaryKeys = allKeys.filter((k) => k.startsWith("diary-"));
      const diaryData: typeof diaries = [];

      for (const key of diaryKeys) {
        const data = await AsyncStorage.getItem(key);
        if (!data) continue;
        try {
          const parsed = JSON.parse(data);
          const emotion = parsed.emotion;
          if (["happy", "sad", "calm", "angry", "neutral"].includes(emotion)) {
            diaryData.push({
              date: key.replace("diary-", ""),
              content: parsed.content,
              emotion: emotion as EmotionType,
            });
          }
        } catch (e) {
          continue;
        }
      }

      const filtered = diaryData.filter((d) => {
        const dDate = dayjs(d.date);
        return (
          dDate.year() === selectedDate.year() &&
          dDate.month() === selectedDate.month()
        );
      });

      filtered.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());

      setDiaries(filtered);
    };
    loadAll();
  }, [selectedDate]);

  const year = selectedDate.year();
  const month = selectedDate.month() + 1;

  return (
    <View style={{ width: "100%" }}>
      <View style={styles.monthHeader}>
        <Pressable
          onPress={() => setShowPicker(true)}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Text style={styles.title}>{`${year}년 ${month}월`}</Text>
          <Ionicons
            name="chevron-down"
            size={16}
            style={{ marginLeft: 4, paddingTop: 20 }}
          />
        </Pressable>
      </View>

      <ScrollView style={styles.listContainer}>
        {diaries.map((d) => (
          <Pressable
            key={d.date}
            onPress={() => router.push(`/view/${d.date}`)}
            style={styles.diaryItem}
          >
            <Image
              source={emotionImages[d.emotion]}
              style={styles.emotionIcon}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.diaryDate}>
                {dayjs(d.date).format("M월 D일")}
              </Text>
              <Text style={styles.diaryText} numberOfLines={2}>
                {d.content}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <MonthYearPicker
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        initialYear={year}
        onSelect={(y, m) =>
          setSelectedDate(
            dayjs()
              .year(y)
              .month(m - 1)
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  monthHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    paddingTop: 20,
    fontFamily: "Cafe24Dongdong",
  },
  listContainer: {
    width: "100%",
    paddingTop: 20,
    paddingHorizontal: 30,
  },
  diaryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5E3B3",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
  },
  emotionIcon: {
    width: 36,
    height: 36,
  },
  diaryDate: {
    fontSize: 16,
    fontFamily: "Cafe24Dongdong",
    color: "#63411F",
  },
  diaryText: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
    width: 250,
    fontFamily: "Cafe24Dongdong",
  },
});
