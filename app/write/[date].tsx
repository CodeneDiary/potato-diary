// app/write/[date].tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const emotionList = ["happy", "calm", "sad", "angry", "neutral", "anxious"];
const emotionImages: Record<string, any> = {
  happy: require("../../assets/images/emotion-happy.png"),
  calm: require("../../assets/images/emotion-calm.png"),
  sad: require("../../assets/images/emotion-sad.png"),
  angry: require("../../assets/images/emotion-angry.png"),
  neutral: require("../../assets/images/emotion-neutral.png"),
  anxious: require("@/assets/images/emotion-anxious.png"),
};
const emotionLabels: Record<string, string> = {
  happy: "기쁨",
  calm: "평온",
  sad: "슬픔",
  angry: "분노",
  neutral: "무감정",
  anxious: "불안",
};

export default function WritePage() {
  const router = useRouter();
  const { date, initial } = useLocalSearchParams();
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState("neutral");
  const [showPicker, setShowPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isEdit = !!initial;

  useEffect(() => {
    if (typeof initial === "string") {
      try {
        const parsed = JSON.parse(initial);
        if (parsed.content) setText(parsed.content);
        if (parsed.emotion && emotionImages[parsed.emotion]) {
          setEmotion(parsed.emotion);
        }
      } catch (e) {}
    }
  }, [initial]);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    console.log("🔵 저장 버튼 클릭됨");
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      console.log("🔵 토큰:", token);
      if (!token) {
        console.log("❌ 토큰이 없음");
      }
      console.log("🔵 fetch 요청 전: ", { text });
      const response = await fetch(
        "https://gamja-friend.onrender.com/diary/text",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ text, date }),
        }
      );
      console.log("🔵 요청 완료. 응답 상태:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ 응답 데이터:", data);
        router.replace(`/view/${date}`); // ✅ 저장 후 해당 일기 보기 페이지로 이동
        setIsSaving(false);
      } else {
        const errorText = await response.text();
        console.log("❌ 오류 응답 데이터:", errorText);
        Alert.alert("오류", errorText || "서버 오류 발생");
        setIsSaving(false);
      }
    } catch (e) {
      console.log("❌ 요청 중 오류 발생:", e);
      Alert.alert("오류", "서버에 연결할 수 없습니다.");
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={28} />
        </Pressable>
        <Pressable onPress={handleSave}>
          <Ionicons name="checkmark" size={28} />
        </Pressable>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.date}>
          {dayjs(date as string).format("M월 D일")}
        </Text>
      </View>

      {/* 감정 선택 (수정 시에만 노출) */}
      {isEdit && (
        <View style={styles.emotionWrapper}>
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Image
              source={emotionImages[emotion]}
              style={styles.emotionImage}
            />
          </TouchableOpacity>

          <Modal visible={showPicker} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>감정을 선택하세요</Text>
                    <View style={styles.emotionPicker}>
                      {emotionList.map((e) => (
                        <TouchableOpacity
                          key={e}
                          onPress={() => {
                            setEmotion(e);
                            setShowPicker(false);
                          }}
                          style={styles.emotionIconBox}
                        >
                          <Image
                            source={emotionImages[e]}
                            style={styles.emotionIcon}
                          />
                          <Text style={styles.emotionLabel}>
                            {emotionLabels[e]}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      )}

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
  emotionWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  emotionImage: {
    width: 60,
    height: 60,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF7E0",
    padding: 20,
    borderRadius: 12,
    width: 280,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
    fontFamily: "Cafe24Dongdong",
    textAlign: "center",
    color: "#63411F",
  },
  emotionPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  emotionIconBox: {
    alignItems: "center",
    margin: 8,
  },
  emotionIcon: {
    width: 48,
    height: 48,
    marginBottom: 4,
  },
  emotionLabel: {
    fontSize: 14,
    color: "#63411F",
    fontFamily: "Cafe24Dongdong",
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  inputBox: {
    width: 330,
    height: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    fontSize: 18,
    color: "#333",
    fontFamily: "Cafe24Dongdong",
    lineHeight: 24,
  },
});
