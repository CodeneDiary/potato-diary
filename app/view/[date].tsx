import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ViewDiaryPage() {
  const { date } = useLocalSearchParams();
  const router = useRouter();
  const [diary, setDiary] = useState<string | null>(null);

  useEffect(() => {
    const loadDiary = async () => {
      try {
        const saved = await AsyncStorage.getItem(`diary-${date}`);
        if (saved) {
          setDiary(saved);
        } else {
          Alert.alert("일기 없음", "작성된 일기가 없습니다.", [
            {
              text: "작성하러 가기",
              onPress: () => router.replace(`/write/${date}`),
            },
          ]);
        }
      } catch (e) {
        Alert.alert("오류", "일기를 불러오는 중 문제가 발생했습니다.");
      }
    };
    loadDiary();
  }, [date]);

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#63411F" />
        </Pressable>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.date}>
          {dayjs(date as string).format("M월 D일")}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.diaryText}>{diary}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7E0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  dateContainer: {
    alignItems: "center",
  },
  date: {
    fontSize: 22,
    marginBottom: 20,
    fontFamily: "Cafe24Dongdong",
    color: "#63411F",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  diaryText: {
    fontSize: 18,
    color: "#333",
    fontFamily: "Cafe24Dongdong",
    lineHeight: 28,
  },
});
