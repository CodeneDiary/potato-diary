import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function WritePage() {
  const router = useRouter();
  const { date } = useLocalSearchParams(); // YYYY-MM-DD
  const [text, setText] = useState("");

  useEffect(() => {
    const loadDiary = async () => {
      const existing = await AsyncStorage.getItem(`diary-${date}`);
      if (existing) setText(existing);
    };
    loadDiary();
  }, [date]);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem(`diary-${date}`, text);
      Alert.alert("저장 완료", `${date} 일기가 저장되었습니다.`);
      router.back();
    } catch (e) {
      Alert.alert("오류", "일기를 저장하는 중 문제가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#63411F" />
        </Pressable>
        <Pressable onPress={handleSave}>
          <Ionicons name="checkmark" size={28} color="#63411F" />
        </Pressable>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.date}>
          {dayjs(date as string).format("M월 D일")}
        </Text>
      </View>

      {/* 본문 영역 */}
      <View style={styles.content}>
        <TextInput
          style={styles.inputBox}
          multiline
          placeholder="오늘의 하루를 기록해보세요"
          textAlignVertical="top"
          value={text}
          onChangeText={setText}
        />
      </View>
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
    justifyContent: "space-between",
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
    flex: 1,
    alignItems: "center",
  },
  inputBox: {
    width: 330,
    height: 370,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    fontSize: 18,
    color: "#333",
    fontFamily: "Cafe24Dongdong",
  },
});
