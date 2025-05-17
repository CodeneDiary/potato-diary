import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import Calendar from "../../components/Calendar";

export default function CalendarPage() {
  const router = useRouter();

  const goToTodayWrite = () => {
    const today = dayjs().format("YYYY-MM-DD");
    router.push(`/write/${today}`);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconGroup}>
          <Pressable onPress={() => console.log("검색 눌림")}>
            <Ionicons name="search" size={24} color="#63411F" />
          </Pressable>
          <Pressable
            onPress={() => console.log("리스트 눌림")}
            style={{ marginLeft: 20 }}
          >
            <Ionicons name="list" size={24} color="#63411F" />
          </Pressable>
        </View>
      </View>
      <Calendar />
      <View style={styles.buttonContainer}>
        <Pressable style={styles.fab} onPress={goToTodayWrite}>
          <Ionicons name="add" size={32} color="#FFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7E0",
    justifyContent: "flex-start", // ← 달력 상단부터 보이게
    alignItems: "center",
    paddingTop: 60,
  },
  header: {
    width: 330,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  iconGroup: {
    flexDirection: "row",
  },
  buttonContainer: {
    width: 330,
    top: 50,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#63411F",
    alignItems: "center",
    justifyContent: "center",
  },
});
