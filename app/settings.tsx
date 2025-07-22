import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { deleteUser, getAuth, signOut } from "firebase/auth";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";

export default function SettingsPage() {
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(true);

  const toggleSwitch = () => setIsEnabled((prev) => !prev);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); // Firebase에서 로그아웃
      await AsyncStorage.removeItem("jwtToken"); // 저장된 토큰 제거
      Alert.alert("로그아웃", "로그아웃 되었습니다.");
      router.replace("/"); // 로그인 페이지로 이동
    } catch (error) {
      console.error("❌ 로그아웃 실패:", error);
      Alert.alert("오류", "로그아웃 중 오류 발생");
    }
  };

  const handleWithdraw = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("오류", "현재 로그인된 사용자가 없습니다.");
      return;
    }

    Alert.alert("회원 탈퇴", "정말 탈퇴하시겠어요?", [
      { text: "취소", style: "cancel" },
      {
        text: "확인",
        onPress: async () => {
          try {
            await deleteUser(user);
            await AsyncStorage.removeItem("jwtToken");
            console.log("✅ 회원 탈퇴 완료");
            Alert.alert("완료", "회원 탈퇴가 완료되었습니다.");
            router.replace("/");
          } catch (error: any) {
            console.error("❌ 회원 탈퇴 실패:", error);
            if (error.code === "auth/requires-recent-login") {
              Alert.alert("실패", "다시 로그인 후 탈퇴해주세요.");
            } else {
              Alert.alert("오류", "탈퇴 중 오류 발생");
            }
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push("/mypage")}>
          <Ionicons name="chevron-back" size={28} />
        </Pressable>
      </View>

      {/* 목록 */}
      <View style={styles.rowContainer}>
        {" "}
        <View style={styles.itemRow}>
          <Text style={styles.itemText}>알림</Text>
          <Switch
            value={isEnabled}
            onValueChange={toggleSwitch}
            trackColor={{ false: "#ccc", true: "#63411F" }}
            thumbColor={isEnabled ? "#FFF7E0" : "#fff"}
          />
        </View>
        <Pressable style={styles.itemRow} onPress={handleLogout}>
          <Text style={styles.itemText}>로그아웃</Text>
        </Pressable>
        <Pressable style={styles.itemRow} onPress={handleWithdraw}>
          <Text style={styles.itemText}>회원 탈퇴</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#FFF7E0",
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0D6BA",
  },
  itemText: {
    fontSize: 20,
    fontFamily: "Cafe24Dongdong",
  },
  rowContainer: {
    paddingHorizontal: 10,
  },
});
