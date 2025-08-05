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
import ChatHistory, { ChatEntry } from "@/app/chathistory";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatHistoryPage() {
  const router = useRouter();
  const { diary_id } = useLocalSearchParams();

  const [diaryId, setDiaryId] = useState<string | undefined>(undefined);
  const [chatData, setChatData] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // diary_id가 유효하지 않으면 AsyncStorage에서 대체값 사용
  useEffect(() => {
    const resolveDiaryId = async () => {
      if (typeof diary_id === "string" && diary_id !== "undefined") {
        setDiaryId(diary_id);
      } else {
        const storedId = await AsyncStorage.getItem("latest_diary_id");
        if (storedId) {
          setDiaryId(storedId);
        } else {
          Alert.alert("에러", "일기 ID가 제공되지 않았고 저장된 ID도 없습니다.");
          setLoading(false); // 로딩 중지
        }
      }
    };
    resolveDiaryId();
  }, [diary_id]);
//   useEffect(() => {
//   const resolveDiaryId = async () => {
//     if (typeof diary_id === "string" && diary_id !== "undefined") {
//       setDiaryId(diary_id);
//     } else {
//       const userId = await AsyncStorage.getItem("firebase_uid");
//       if (!userId) {
//         Alert.alert("에러", "사용자 ID가 없습니다. 다시 로그인해주세요.");
//         setLoading(false);
//         return;
//       }

//       const storedId = await AsyncStorage.getItem(`latest_diary_id_${userId}`);
//       if (storedId) {
//         setDiaryId(storedId);
//       } else {
//         Alert.alert("에러", "일기 ID가 제공되지 않았고 저장된 ID도 없습니다.");
//         setLoading(false);
//       }
//     }
//   };
//   resolveDiaryId();
// }, [diary_id]);


  // diaryId가 준비된 경우에만 대화 불러오기
  useEffect(() => {
    if (!diaryId) return;

    const fetchChatLogs = async () => {
      try {
        const res = await fetch(
          `https://gamja-friend.onrender.com/chat-history?diary_id=${diaryId}`
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
  }, [diaryId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace("/calendar")}>
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
