import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { getFirebaseAuth } from "../config/firebaseConfig";

import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fireBaseAuth = getFirebaseAuth();

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      if (token) {
        router.replace("/(tabs)/calendar");
      }
    } catch (error) {
      console.error("로그인 상태 확인 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      console.log("로그인 시도 중 - 이메일:", email, "비밀번호:", password);
      const userCredential = await signInWithEmailAndPassword(
        fireBaseAuth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();
      console.log("로그인 성공, idToken:", idToken);

      await AsyncStorage.setItem("jwtToken", idToken);
      console.log("idToken 저장 완료");

      router.replace("/(tabs)/calendar");
    } catch (error) {
      if (error instanceof Error) {
        console.error("로그인 오류:", error.message);
        alert("로그인 실패. " + error.message);
      } else {
        console.error("로그인 오류: 알 수 없는 오류", error);
        alert("로그인 실패. 알 수 없는 오류");
      }
    }
  };

  const handleSignUp = () => {
    console.log("회원가입 버튼 클릭");
    router.push("/signup");
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/potato.png")}
        style={{ width: 100, height: 100, marginBottom: 30 }}
      />
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignUp}>
        <Text style={styles.signUpText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFF7E0",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#63411F",
    fontFamily: "Cafe24Dongdong",
  },
  input: {
    width: 330,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#ffffff",
  },
  loginButton: {
    backgroundColor: "#63411F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    width: 330,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpText: {
    marginTop: 15,
    color: "#63411F",
    fontSize: 14,
  },
});
