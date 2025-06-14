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

  // 첫 질문 요청 및 base64 음성 재생
  useEffect(() => {
  const getDiaryId = async () => {
    if (!parsedDiaryId) {
      const storedId = await AsyncStorage.getItem("latest_diary_id");
      if (storedId) {
        setDiaryId(storedId);
      }
    }
  };
  getDiaryId();
}, [parsedDiaryId]);

  // 오디오 설정
  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: true,
        });
      } catch (error) {
        console.error("❌ 오디오 모드 설정 실패:", error);
      }
    };
    configureAudio();
  }, []);


  useEffect(() => {
    const fetchFirstQuestion = async () => {
      try {
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

        if (!question || !audioBase64) {
          throw new Error("백엔드에서 질문 또는 음성 데이터가 없습니다.");
        }
        setHistory([{ user_input: "", response: question }]);

        try {
          const sound = new Audio.Sound();
          await sound.loadAsync({ uri: `data:audio/mp3;base64,${audioBase64}` });
          await sound.setVolumeAsync(1.0);
          await sound.playAsync();

        } catch (soundError) {
          console.error("음성 재생 실패:", soundError);
          Alert.alert("오디오 오류", "음성 재생 중 문제가 발생했습니다.");
        }
        
      } catch (error) {
        console.error("첫 질문 생성 실패:", error);
        Alert.alert("에러", "챗봇의 첫 질문을 받아오지 못했습니다.");
      }
    };

    fetchFirstQuestion();
  }, [parsedDiaryId]);

  // 대화 응답 저장 (음성은 따로 재생)
  const handleComplete = (
    input: string,
    response: string,
    audioBase64?: string
  ) => {
    setHistory((prev) => [...prev, { user_input: input, response }]);

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

  const handleExit = () => {
    router.push({
      pathname: "/chathistorypage",
      query: { diary_id: parsedDiaryId },
    } as any);
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
});