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
    } catch (error: any) {
      // Firebase 에러 코드별 한국어 메시지
      let errorMessage = "";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "이미 사용 중인 이메일입니다.";
          break;
        case "auth/invalid-email":
          errorMessage = "유효하지 않은 이메일 형식입니다.";
          break;
        case "auth/weak-password":
          errorMessage = "비밀번호가 너무 약합니다. 6자 이상 입력해주세요.";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "이메일/비밀번호 계정이 활성화되지 않았습니다.";
          break;
        default:
          errorMessage = "회원가입 중 오류가 발생했습니다: " + error.message;
          break;
      }

      alert("회원가입 실패: " + errorMessage);
    }
  };

  const canSignUp =
    email !== "" &&
    password !== "" &&
    confirmPassword !== "" &&
    !passwordMatchError;

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
          placeholder="비밀번호 (6자 이상)"
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
            !canSignUp && styles.signUpButtonDisabled,
          ]}
          onPress={handleSignUp}
          disabled={!canSignUp}
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
  infoText: {
    color: "#63411f",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  warningText: {
    color: "#ff9900",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
});
