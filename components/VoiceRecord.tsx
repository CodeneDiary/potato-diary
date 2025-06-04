import { Audio } from "expo-av";
import { useState } from "react";
import { Alert } from "react-native";

export default function useVoiceRecorder(
  onComplete: (input: string, response: string, audio_url?: string) => void,
  chatHistory: { user_input: string; response: string; audio_url?: string }[],
  diary_id?: string | number
) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = async () => {
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
      } catch (e) {
        console.error("녹음 시작 실패:", e);
      }
    } else {
      try {
        if (!recording) return;

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null); //상태 초기화
        setIsRecording(false);

        if (!uri) return;

        const formData = new FormData();
        formData.append("file", {
          uri,
          name: "voice.m4a",
          type: "audio/m4a",
        } as any);
        formData.append("history", JSON.stringify(chatHistory));
        if (diary_id) {
          formData.append("diary_id", diary_id.toString()); //diary_id 포함
        }

        const res = await fetch("https://gamja-friend.onrender.com/upload", {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (!res.ok) {
          throw new Error(`서버 오류: ${res.status}`);
        }

        const data = await res.json();
        onComplete(data.input, data.response, data.audio_url);
      } catch (e) {
        console.error("녹음 중단 오류:", e);
        Alert.alert("서버 오류", "응답을 받아오지 못했습니다.");
      }
    }
  };

  return { toggleRecording, isRecording };
}
