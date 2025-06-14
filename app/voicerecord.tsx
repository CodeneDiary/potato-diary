import { Audio } from "expo-av";
import { useState } from "react";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";

export default function useVoiceRecorder(
  onComplete: (input: string, response: string, audioBase64?: string) => void,
  chatHistory: { user_input: string; response: string }[],
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
        setRecording(null);
        setIsRecording(false);

        if (!uri) return;

        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
          console.warn("파일이 존재하지 않습니다:", fileInfo.uri);
          return;
        }

        const base64Audio = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const res = await fetch("https://gamja-friend.onrender.com/upload-base64", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            diary_id: diary_id?.toString(),
            history: chatHistory,
            audio_base64: base64Audio,
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`서버 오류 ${res.status}:`, errorText);
          throw new Error(`서버 오류: ${res.status}`);
        }

        const data = await res.json();
        const { input, response, audio_base64 } = data;

        onComplete(input, response, audio_base64);
      } catch (e) {
        console.error("녹음 중단 오류:", e);
        Alert.alert("서버 오류", "응답을 받아오지 못했습니다.");
      }
    }
  };

  return { toggleRecording, isRecording };
}
