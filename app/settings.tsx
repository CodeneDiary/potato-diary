import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";

export default function SettingsPage() {
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(true);

  const toggleSwitch = () => setIsEnabled((prev) => !prev);

  const handleLogout = () => {
    Alert.alert("로그아웃", "로그아웃 하시겠어요?", [
      { text: "취소", style: "cancel" },
      { text: "확인", onPress: () => console.log("로그아웃 로직 실행") },
    ]);
  };

  const handleWithdraw = () => {
    Alert.alert("회원 탈퇴", "정말로 탈퇴하시겠어요?", [
      { text: "취소", style: "cancel" },
      { text: "확인", onPress: () => console.log("회원 탈퇴 로직 실행") },
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
