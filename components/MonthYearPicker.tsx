import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (year: number, month: number) => void;
  initialYear: number;
};

export default function MonthYearPicker({
  visible,
  onClose,
  onSelect,
  initialYear,
}: Props) {
  const [selectedYear, setSelectedYear] = useState(initialYear);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.yearControlRow}>
                <Pressable onPress={() => setSelectedYear((y) => y - 1)}>
                  <Ionicons name="chevron-back" size={24} color="#63411F" />
                </Pressable>
                <Text style={styles.yearText}>{selectedYear}</Text>
                <Pressable onPress={() => setSelectedYear((y) => y + 1)}>
                  <Ionicons name="chevron-forward" size={24} color="#63411F" />
                </Pressable>
              </View>

              <FlatList
                data={Array.from({ length: 12 }, (_, i) => i + 1)}
                numColumns={3}
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.monthButton}
                    onPress={() => {
                      onSelect(selectedYear, item);
                      onClose();
                    }}
                  >
                    <Text style={styles.monthText}>{item}월</Text>
                  </Pressable>
                )}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#FFF7E0",
    padding: 20,
    borderRadius: 12,
    width: 300,
    maxHeight: 400,
    alignItems: "center",
  },
  yearControlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    width: "60%",
  },
  yearText: {
    fontSize: 18,
    color: "#63411F",
    fontFamily: "Cafe24Dongdong",
    textAlign: "center",
  },
  monthButton: {
    backgroundColor: "#F5E3B3",
    borderRadius: 8,
    paddingVertical: 10,
    margin: 6,
    width: 70,
    alignItems: "center",
  },
  monthText: {
    fontSize: 16,
    color: "#63411F",
    fontFamily: "Cafe24Dongdong",
  },
});
