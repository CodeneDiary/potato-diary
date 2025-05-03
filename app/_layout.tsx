import { View } from "react-native";
import Calendar from "../components/calender";

export default function CalendarPage() {
  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "#FFF7E0" }}>
      <Calendar />
    </View>
  );
}
