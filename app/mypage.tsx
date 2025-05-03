import { StyleSheet, View } from "react-native";

export default function MyPage() {
  return <View style={styles.container}></View>;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7E0",
    justifyContent: "flex-start", // ← 달력 상단부터 보이게
    alignItems: "center",
    paddingTop: 60,
  },
});
