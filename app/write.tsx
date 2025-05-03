import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function WritePage() {
  const router = useRouter();
  const today = dayjs().format(" M월 D일");

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={28} />
        </Pressable>
        <Pressable
          onPress={() => {
            // 저장 로직 추가 예정
            console.log("저장!");
            router.back(); // 저장 후 뒤로
          }}
        >
          <Ionicons name="checkmark" size={28} />
        </Pressable>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{today}</Text>
      </View>
      {/* 본문 영역 */}
      <View style={styles.content}>
        <TextInput
          style={styles.inputBox}
          multiline
          placeholder="오늘의 하루를 기록해보세요"
          textAlignVertical="top"
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
