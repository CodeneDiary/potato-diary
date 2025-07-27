// app/view/[date].tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { emotionToGroup } from "../../utils/emotionMap";

const emotionImages: Record<string, any> = {
  happy: require("../../assets/images/emotion-happy.png"),
  sad: require("../../assets/images/emotion-sad.png"),
  calm: require("../../assets/images/emotion-calm.png"),
  angry: require("../../assets/images/emotion-angry.png"),
  neutral: require("../../assets/images/emotion-neutral.png"),
  anxious: require("@/assets/images/emotion-anxious.png"),
};

export default function ViewDiaryPage() {
  const { date } = useLocalSearchParams();
  const router = useRouter();
  const [diary, setDiary] = useState<{
    emotion: string;
    content: string;
    rawEmotion: string;
    id: number;
  } | null>(null);

  useEffect(() => {
    const loadDiary = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        const authHeader = token ? `Bearer ${token}` : "";
        const response = await fetch(
          `https://gamja-friend.onrender.com/diary/by-date/${date}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader,
            },
          }
        );
        if (response.status === 401) {
          console.warn(
            "⛔️ 토큰이 만료되었거나 유효하지 않음. 로그인 페이지로 이동."
          );
          await AsyncStorage.removeItem("jwtToken");
          router.replace("/");
          return;
        }
        if (response.ok) {
          const data = await response.json();
          if (data) {
            const mappedEmotion = emotionToGroup[data.emotion] || "neutral";
            setDiary({
              emotion: mappedEmotion,
              content: data.content ?? data.text ?? "",
              rawEmotion: data.emotion,
              id: data.id,
            });
          } else {
            setDiary(null);
          }
        } else {
          const errorData = await response.json().catch(() => null);
          console.error("❌ 일기 데이터 불러오기 실패!");
          console.error("상태 코드:", response.status);
          console.error("응답 내용:", errorData);
          setDiary(null);
        }
      } catch (error) {
        console.error("일기 데이터 요청 중 오류 발생", error);
        setDiary(null);
      }
    };
    loadDiary();
  }, [date]);

  const handleDelete = () => {
    if (!diary) return;

    Alert.alert("일기 삭제", "정말 삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("jwtToken");
            const authHeader = token ? `Bearer ${token}` : "";
            const response = await fetch(
              `https://gamja-friend.onrender.com/diary/${diary.id}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: authHeader,
                },
              }
            );

            if (response.ok) {
              router.push("/calendar");
            } else {
              const errorData = await response.json().catch(() => null);
              console.error("❌ 일기 삭제 실패:", errorData);
              Alert.alert("삭제 실패", "일기를 삭제하지 못했습니다.");
            }
          } catch (e) {
            console.error("❌ 삭제 요청 오류:", e);
            Alert.alert("오류", "일기 삭제 중 문제가 발생했습니다.");
          }
        },
      },
    ]);
  };

  const handleEdit = () => {
    if (!diary) return;
    router.push({
      pathname: "/modify/[date]",
      params: {
        date: date as string,
        initial: JSON.stringify(diary),
      },
    });
  };

  const handleChatbot = async () => {
    if (!diary) return;

    try {
      const diaryId = diary.id;
      if (!diaryId) {
        Alert.alert("에러", "해당 일기 ID를 찾을 수 없습니다.");
        return;
      }

      const isChatDone = await AsyncStorage.getItem(`chat_done_${diaryId}`);
      //await AsyncStorage.setItem("latest_diary_id", String(diaryId));

      if (isChatDone) {
        router.push({
          pathname: "/chathistorypage",
          params: { diary_id: String(diaryId) },
        });
      } else {
        router.push({
          pathname: "/chatbot",
          params: { diary_id: String(diaryId) },
        });
      }
    } catch (e) {
      console.error("❌ 감정 챗봇 분기 오류", e);
      Alert.alert("에러", "감정 챗봇 실행 중 오류가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace("/calendar")}>
          <Ionicons name="chevron-back" size={28} color="#63411F" />
        </Pressable>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.date}>
          {dayjs(date as string).format("M월 D일")}
        </Text>
        {diary && (
          <>
            <Image
              source={emotionImages[diary.emotion]}
              style={styles.emotionImage}
            />
            <Text style={styles.emotionLabel}>{diary.rawEmotion}</Text>
          </>
        )}
      </View>

      {diary ? (
        <View>
          <View style={styles.diarySection}>
            <ScrollView style={styles.scrollBox}>
              <Text style={styles.diaryText}>{diary.content}</Text>
            </ScrollView>
          </View>
          <View style={styles.actionIcons}>
            <Pressable onPress={handleEdit}>
              <Ionicons name="create-outline" size={26} color="#63411F" />
            </Pressable>
            <Pressable onPress={handleDelete} style={{ marginLeft: 24 }}>
              <Ionicons name="trash-outline" size={26} color="#63411F" />
            </Pressable>
          </View>
        </View>
      ) : (
        <Text style={styles.diaryText}>작성된 일기가 없습니다.</Text>
      )}

      <View style={styles.extraButtons}>
        <Pressable
          style={styles.extraButton}
          onPress={() =>
            router.push({
              pathname: "/recommend",
              params: {
                emotion: diary?.rawEmotion,
              },
            })
          }
        >
          <Ionicons
            name="sparkles-outline"
            size={20}
            color="#63411F"
            style={styles.icon}
          />
          <Text style={styles.extraButtonText}>추천 콘텐츠</Text>
        </Pressable>

        <Pressable
          style={[styles.extraButton, { marginLeft: 12 }]}
          onPress={handleChatbot}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={20}
            color="#63411F"
            style={styles.icon}
          />
          <Text style={styles.extraButtonText}>감정 챗봇</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7E0",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  dateContainer: {
    alignItems: "center",
  },
  date: {
    fontSize: 22,
    marginBottom: 10,
    fontFamily: "Cafe24Dongdong",
    color: "#63411F",
  },
  emotionImage: {
    width: 60,
    height: 60,
    marginBottom: 20,
    marginTop: 10,
  },
  emotionLabel: {
    fontSize: 18,
    fontFamily: "Cafe24Dongdong",
    color: "#63411F",
    marginBottom: 10,
  },
  diarySection: {
    width: 330,
    height: 360,
    backgroundColor: "#F5E3B3",
    borderRadius: 10,
    padding: 16,
    fontSize: 18,
    color: "#333",
    fontFamily: "Cafe24Dongdong",
  },
  scrollBox: {
    flexGrow: 1,
  },
  diaryText: {
    fontSize: 18,
    color: "#333",
    fontFamily: "Cafe24Dongdong",
    lineHeight: 28,
  },
  actionIcons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    marginRight: 5,
  },
  extraButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  extraButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5E3B3",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    width: 160,
    height: 60,
    justifyContent: "center",
  },
  extraButtonText: {
    fontSize: 18,
    color: "#63411F",
    fontFamily: "Cafe24Dongdong",
    marginLeft: 6,
    textAlign: "center",
  },
  icon: {
    marginRight: 4,
  },
});
