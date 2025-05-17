import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MyPage() {
  const router = useRouter();

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
