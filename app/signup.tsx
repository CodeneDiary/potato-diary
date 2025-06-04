import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getFirebaseAuth } from "../config/firebaseConfig";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const router = useRouter();
  const fireBaseAuth = getFirebaseAuth();

  useEffect(() => {
    if (confirmPassword !== "") {
      setPasswordMatchError(password !== confirmPassword);
    } else {
      setPasswordMatchError(false);
    }
  }, [password, confirmPassword]);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        fireBaseAuth,
        email,
        password
      );
      alert("회원가입하였습니다");
      router.replace("/"); // 회원가입 후 로그인 페이지로 이동
    } catch (error) {
      if (error instanceof Error) {
        console.error("회원가입 오류:", error.message);
        alert("회원가입 실패. " + error.message);
      } else {
        console.error("회원가입 오류: 알 수 없는 오류", error);
        alert("회원가입 실패. 알 수 없는 오류");
      }
    }
  };

  const isFormValid = email !== "" && password !== "" && confirmPassword !== "";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.text}>이메일</Text>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.text}>비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={styles.text}>비밀번호 확인</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {passwordMatchError && (
          <Text style={styles.errorText}>비밀번호가 일치하지 않습니다.</Text>
        )}
        <TouchableOpacity
          style={[
            styles.signUpButton,
            (!isFormValid || passwordMatchError) && styles.signUpButtonDisabled,
          ]}
          onPress={handleSignUp}
          disabled={!isFormValid || passwordMatchError}
        >
          <Text style={styles.signUpButtonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF7E0",
  },
  inputContainer: {
    alignItems: "flex-start",
    width: 330,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    color: "#63411F",
    fontFamily: "Cafe24Dongdong",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  signUpButton: {
    backgroundColor: "#63411F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  signUpButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  signUpButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  text: {
    color: "#63411f",
    fontSize: 14,
    marginLeft: 5,
    marginBottom: 10,
    fontWeight: "semibold",
  },
});
