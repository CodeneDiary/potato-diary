import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (confirmPassword !== "") {
      setPasswordMatchError(password !== confirmPassword);
    } else {
      setPasswordMatchError(false);
    }
  }, [password, confirmPassword]);

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      return;
    }
    // TODO: 백엔드에 회원가입 API 호출
    alert("회원가입 성공!");
    router.replace("/");
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
