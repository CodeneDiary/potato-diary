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
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Audio } from "expo-av";

export default function ChatbotVoice() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { user_input: string; response: string }[]
  >([]);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const toggleRecording = async () => {
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

    if (!isRecording) {
      try {
        const permission = await Audio.requestPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("마이크 권한이 필요합니다.");
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
        setIsRecording(true);
      } catch (err) {
        console.error("녹음 오류:", err);
      }
    } else {
      try {
        if (!recording) return;
        await recording.stopAndUnloadAsync();
        setIsRecording(false);

        const uri = recording.getURI();
        if (!uri) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", {
          uri,
          name: "voice.m4a",
          type: "audio/m4a",
        } as any);
        formData.append("history", JSON.stringify(chatHistory));

        const res = await fetch("https://gamja-friend.onrender.com/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

        const data = await res.json();
        setChatHistory((prev) => [
          ...prev,
          { user_input: data.input, response: data.response },
        ]);
        setLoading(false);
      } catch (err) {
        console.error("전송 오류:", err);
        Alert.alert("서버 오류", "응답을 받아오지 못했습니다.");
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#63411F" />
        </Pressable>
      </View>

      <View style={styles.imageWrapper}>
        <Text style={styles.title}>감정 챗봇</Text>
        <Image
          source={require("@/assets/images/potato.png")}
          style={styles.potatoImage}
          resizeMode="contain"
        />
      </View>

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

      <ScrollView style={styles.responseWrapper}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            {chatHistory.map((entry, idx) => (
              <View key={idx} style={{ marginBottom: 16 }}>
                <Text style={{ fontWeight: "bold", color: "#63411F" }}>
                  사용자
                </Text>
                <Text style={styles.responseText}>{entry.user_input}</Text>

                <Text
                  style={{ fontWeight: "bold", marginTop: 4, color: "#C94A4A" }}
                >
                  감자
                </Text>
                <Text style={styles.responseText}>{entry.response}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
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
  responseWrapper: {
    marginTop: 40,
    paddingHorizontal: 24,
  },
  responseText: {
    fontSize: 16,
    color: "#222",
  },
});
