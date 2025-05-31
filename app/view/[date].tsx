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

const emotionImages: Record<string, any> = {
  happy: require("../../assets/images/emotion-happy.png"),
  sad: require("../../assets/images/emotion-sad.png"),
  calm: require("../../assets/images/emotion-calm.png"),
  angry: require("../../assets/images/emotion-angry.png"),
  neutral: require("../../assets/images/emotion-neutral.png"),
};

export default function ViewDiaryPage() {
  const { date } = useLocalSearchParams();
  const router = useRouter();
  const [diary, setDiary] = useState<{
    emotion: string;
    content: string;
  } | null>(null);

  useEffect(() => {
    const loadDiary = async () => {
      try {
        const response = await fetch(
          "https://gamja-friend.onrender.com/diary/list",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer dev-token",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const diaryEntry = data.find((entry: any) => {
            const entryDate = dayjs(entry.created_at).format("YYYY-MM-DD");
            return entryDate === date;
          });
          if (diaryEntry) {
            setDiary({
              emotion: diaryEntry.emotion.toLowerCase(),
              content: diaryEntry.content,
            });
          } else {
            setDiary(null);
          }
        } else {
          console.error("서버에서 일기 데이터를 가져오지 못했습니다.");
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
    Alert.alert("일기 삭제", "정말 삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem(`diary-${date}`);
          router.replace("/calendar");
        },
      },
    ]);
  };

  const handleEdit = () => {
    if (!diary) return;
    router.push({
      pathname: "/write/[date]",
      params: {
        date: date as string,
        initial: JSON.stringify(diary),
      },
    });
  };

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
        {diary && (
          <Image
            source={emotionImages[diary.emotion]}
            style={styles.emotionImage}
          />
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
          onPress={() => router.push("/recommend")}
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
          onPress={() => router.push("/chatbot")}
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
