import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import useVoiceRecorder from "@/components/VoiceRecord";

export default function ChatbotVoicePage() {
  const router = useRouter();
  const { diary_id } = useLocalSearchParams();
  const [isRecording, setIsRecording] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [history, setHistory] = useState<
    { user_input: string; response: string; audio_url?: string }[]
  >([]);

  const parsedDiaryId = Array.isArray(diary_id) ? diary_id[0] : (diary_id as string);

  // 첫 질문 요청 + TTS 재생
  useEffect(() => {
    const fetchFirstQuestion = async () => {
      try {
        const res = await fetch("https://gamja-friend.onrender.com/generate-question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ diary_id: diary_id }),
        });
        const data = await res.json();
        const question = data.question;

        setHistory([{ user_input: "", response: question }]);
      } catch (error) {
        console.error("첫 질문 생성 실패:", error);
        Alert.alert("에러", "챗봇의 첫 질문을 받아오지 못했습니다.");
      }
    };

    fetchFirstQuestion();
  }, [parsedDiaryId]);
//   useEffect(() => {
//   const fetchFirstQuestion = async () => {
//     try {
//       const res = await fetch("https://gamja-friend.onrender.com/generate-question", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           diary_text: "오늘은 친구랑 다퉜는데 마음이 너무 무거웠다. 어떻게 해야 할지 모르겠다."
//         }),
//       });
//       const data = await res.json();
//       const question = data.question;

//       setHistory([{ user_input: "", response: question }]);
//     } catch (error) {
//       console.error("첫 질문 생성 실패:", error);
//       Alert.alert("에러", "챗봇의 첫 질문을 받아오지 못했습니다.");
//     }
//   };

//   fetchFirstQuestion();
// }, []);

  // 대화 응답 핸들링
  const handleComplete = (
    input: string,
    response: string,
    audio_url?: string
  ) => {
    setHistory((prev) => [...prev, { user_input: input, response, audio_url }]);
  };

  // 음성 녹음 토글
  const { toggleRecording } = useVoiceRecorder(handleComplete, history, parsedDiaryId);

  const handleMicPress = () => {
    setIsRecording((prev) => !prev);
    toggleRecording();

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 대화 종료 → 대화 내역 페이지 이동
  const handleExit = () => {
    const parsedDiaryId = Array.isArray(diary_id) ? diary_id[0] : diary_id as string;
    router.push({
    pathname: "/chat-history",
    query: { diary_id: parsedDiaryId }
  } as any);
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#63411F" />
        </Pressable>
        <Text style={styles.title}>감정 챗봇</Text>
        <Pressable onPress={handleExit}>
          <Text style={styles.exitText}>대화 종료</Text>
        </Pressable>
      </View>

      {/* 감자 이미지 */}
      <View style={styles.imageWrapper}>
        <Image
          source={require("@/assets/images/potato.png")}
          style={styles.potatoImage}
          resizeMode="contain"
        />
      </View>

      {/* 마이크 버튼 */}
      <View style={styles.content}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Pressable
            onPress={handleMicPress}
            style={[styles.micButton, isRecording && styles.micButtonActive]}
          >
            <Ionicons
              name="mic-outline"
              size={50}
              color={isRecording ? "#fff" : "#63411F"}
            />
          </Pressable>
        </Animated.View>
      </View>
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
  exitText: {
    fontSize: 16,
    color: "#C94A4A",
  },
  imageWrapper: {
    alignItems: "center",
    marginTop: 10,
  },
  potatoImage: {
    marginTop: 60,
    width: 160,
    height: 160,
  },
  content: {
    marginTop: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5E3B3",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  micButtonActive: {
    backgroundColor: "#C94A4A",
  },
});
