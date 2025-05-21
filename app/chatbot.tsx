import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Chatbot() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);

    // 버튼 클릭 애니메이션
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

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#63411F" />
        </Pressable>
      </View>

      {/* 감자 이미지 */}
      <View style={styles.imageWrapper}>
        <Text style={styles.title}>감정 챗봇</Text>
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
            onPress={toggleRecording}
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
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    marginLeft: 10,
    fontSize: 28,
    fontFamily: "Cafe24Dongdong",
    color: "#63411F",
  },
  imageWrapper: {
    alignItems: "center",
    marginTop: 10,
  },
  potatoImage: {
    marginTop: 70,
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
