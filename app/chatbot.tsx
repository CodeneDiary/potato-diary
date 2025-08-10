import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import useVoiceRecorder from "@/app/voicerecord";

export default function ChatbotVoicePage() {
  const router = useRouter();
  const { diary_id, date } = useLocalSearchParams();

  const parsedDiaryId = typeof diary_id === "string" ? diary_id : Array.isArray(diary_id) ? diary_id[0] : undefined;
  const parsedDate = typeof date === "string" ? date : Array.isArray(date) ? date[0] : undefined;

  const [diaryId, setDiaryId] = useState<string | undefined>(parsedDiaryId);
  const [isRecording, setIsRecording] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [history, setHistory] = useState<
    { user_input: string; response: string }[]
  >([]);

  // 자막 상태 추가
  const [subtitle, setSubtitle] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);

  // 자막 타이핑 애니메이션 함수
  const subtitleRef = useRef(""); // 실시간 자막 저장용 ref

  const typeSubtitle = (text: string) => {
    if (typeof text !== "string") return;

    subtitleRef.current = ""; // 초기화
    setIsTyping(true);
    setSubtitle(""); // 실제 출력 초기화

    let i = 0;

    const interval = setInterval(() => {
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        setTimeout(() => setSubtitle(""), 5000);
        return;
      }

      subtitleRef.current += text.charAt(i); // ref에 추가
      setSubtitle(subtitleRef.current);     // 상태는 항상 ref 값 복사
      i++;
    }, 50);
  };


  useEffect(() => {
  const getDiaryId = async () => {
    if (!parsedDiaryId) {
      //const storedId = await AsyncStorage.getItem("latest_diary_id");
      const userId = await AsyncStorage.getItem("firebase_uid");
      if (!userId) {
        console.error("❌ firebase_uid를 찾을 수 없습니다.");
        return;
      }

      const storedId = await AsyncStorage.getItem(`latest_diary_id_${userId}`);
      if (storedId) {
        setDiaryId(storedId);
      }
    }
  };
  getDiaryId();
}, [parsedDiaryId]);

  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: true,
        });
        console.log("🎧 오디오 모드 설정 완료");
      } catch (error) {
        console.error("❌ 오디오 모드 설정 실패:", error);
      }
    };

    configureAudio();
  }, []);

  useEffect(() => {
    const fetchFirstQuestion = async () => {
      try {
        console.log("🟡 fetchFirstQuestion 실행됨");

        let diaryId = parsedDiaryId;
        if (!diaryId) {
          const storedId = await AsyncStorage.getItem("latest_diary_id");
          if (!storedId) {
            Alert.alert("에러", "일기 ID가 제공되지 않았습니다.");
            return;
          }
          diaryId = storedId;
        }

        console.log("✅ 최종 사용될 diaryId:", diaryId);

        const res = await fetch("https://gamja-friend.onrender.com/generate-question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ diary_id: diaryId }),
        });

        const data = await res.json();
        const question = data.question;
        const audioBase64 = data.audio_base64;
        console.log("🎧 base64 길이:", audioBase64?.length);

        if (!question || !audioBase64) {
          throw new Error("백엔드에서 질문 또는 음성 데이터가 없습니다.");
        }

        setHistory([{ user_input: "", response: question }]);
        console.log("📝 첫 질문 저장 완료");

        //
        const userId = await AsyncStorage.getItem("firebase_uid");
        if (userId) {
          await AsyncStorage.setItem(`latest_diary_id_${userId}`, diaryId);
        }
        //

        await AsyncStorage.setItem(`chat_done_${diaryId}`, "true");

        try {
          const sound = new Audio.Sound();
          await sound.loadAsync({ uri: `data:audio/mp3;base64,${audioBase64}` });
          await sound.setVolumeAsync(1.0);
          await sound.playAsync();
          console.log("🔊 음성 재생 완료");
        } catch (soundError) {
          console.error("❌ 음성 재생 실패:", soundError);
          Alert.alert("오디오 오류", "음성 재생 중 문제가 발생했습니다.");
        }

        // 자막 출력
        typeSubtitle(question);

      } catch (error) {
        console.error("❌ 첫 질문 생성 실패:", error);
        Alert.alert("에러", "챗봇의 첫 질문을 받아오지 못했습니다.");
      }
    };

    fetchFirstQuestion();
  }, [parsedDiaryId]);

  const handleComplete = (
    input: string,
    response: string,
    audioBase64?: string
  ) => {
    setHistory((prev) => [...prev, { user_input: input, response }]);
    typeSubtitle(response); // 응답 자막 출력

    if (audioBase64) {
      const playAudio = async () => {
        const sound = new Audio.Sound();
        await sound.loadAsync({ uri: `data:audio/mp3;base64,${audioBase64}` });
        await sound.playAsync();
      };
      playAudio();
    }
  };

  const { toggleRecording } = useVoiceRecorder(handleComplete, history, diaryId);
  console.log("🎯 parsedDiaryId to VoiceRecorder:", diaryId);

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

  // const handleExit = () => {
  //   router.push({
  //     pathname: "/chathistorypage",
  //     query: { diary_id: parsedDiaryId },
  //   } as any);
  // };
  // 수정
  const handleExit = async () => {
    try {
      // 현재 화면에서 사용할 diaryId 결정 (state가 우선, 없으면 URL 파라미터)
      const effectiveDiaryId = diaryId ?? parsedDiaryId;
      if (!effectiveDiaryId) {
        Alert.alert("에러", "일기 ID가 없습니다. 다시 시도해주세요.");
        return;
      }

      // UID 조회
      const userId = await AsyncStorage.getItem("firebase_uid");

      // 유저별 키에 먼저 저장
      if (userId) {
        await AsyncStorage.setItem(
          `latest_diary_id_${userId}`,
          String(effectiveDiaryId)
        );
      }

      // 레거시 키에도 미러 저장 (히스토리 페이지 fallback용)
      await AsyncStorage.setItem("latest_diary_id", String(effectiveDiaryId));

      // 라우팅 (쿼리로 diary_id 전달하면 히스토리 페이지가 가장 우선 사용)
      router.push({
        pathname: "/chathistorypage",
        query: { diary_id: String(effectiveDiaryId) },
      } as any);
    } catch (e) {
      console.error("Exit error:", e);
      Alert.alert("에러", "대화 내역 이동 중 문제가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#63411F" />
        </Pressable>
        <Text style={styles.title}>감정 챗봇</Text>
        <Pressable onPress={handleExit}>
          <Text style={styles.exitText}>대화 종료</Text>
        </Pressable>
      </View>

      <View style={styles.imageWrapper}>
        <Image
          source={require("@/assets/images/potato.png")}
          style={styles.potatoImage}
          resizeMode="contain"
        />
      </View>

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

      {/* 자막 UI */}
      {subtitle !== "" && (
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>{subtitle}</Text>
        </View>
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
  exitText: {
    fontSize: 16,
    fontFamily: "Cafe24Dongdong",
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
  // 자막 스타일
  subtitleContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "rgba(225, 173, 99, 0.6)",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  subtitleText: {
    color: "#000000",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Cafe24Dongdong",
  },
});
