// app/index.tsx
import { StyleSheet, Text, View } from "react-native";

export default function CalendarPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 달력 페이지</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7E0",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#63411F",
  },
});
