// ChatHistoryPage.tsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import ChatHistory, { ChatEntry } from "@/components/ChatHistory";

export default function ChatHistoryPage() {
  const router = useRouter();
  const { diary_id } = useLocalSearchParams();
  const [chatData, setChatData] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const parsedDiaryId = Array.isArray(diary_id) ? diary_id[0] : (diary_id as string);

  useEffect(() => {
    const fetchChatLogs = async () => {
      try {
        const res = await fetch(
          `https://gamja-friend.onrender.com/chat-history?diary_id=${parsedDiaryId}`
        );
        if (!res.ok) throw new Error("서버 오류");
        const data = await res.json();
        setChatData(data.logs);
      } catch (error) {
        console.error("대화 불러오기 실패:", error);
        Alert.alert("불러오기 실패", "대화 내역을 가져오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchChatLogs();
  }, [parsedDiaryId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#63411F" />
        </Pressable>
        <Text style={styles.title}>대화 내역</Text>
        <View style={{ width: 28 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#C94A4A" />
        </View>
      ) : chatData.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>저장된 대화가 없습니다.</Text>
        </View>
      ) : (
        <ScrollView>
          <ChatHistory chatData={chatData} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7E0",
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: "Cafe24Dongdong",
    color: "#63411F",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});
