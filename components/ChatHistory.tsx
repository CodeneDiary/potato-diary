// ChatHistory.tsx
import { View, Text, StyleSheet } from "react-native";

export type ChatEntry = {
  user_input: string;
  response: string;
  audio_url?: string;
};

interface ChatHistoryProps {
  chatData: ChatEntry[];
}

export default function ChatHistory({ chatData }: ChatHistoryProps) {
  return (
    <View style={styles.chatContainer}>
      {chatData.map((entry, idx) => (
        <View key={idx} style={styles.bubbleWrapper}>
          {entry.user_input && (
            <View style={styles.userRow}>
              <View style={styles.userBubble}>
                <Text style={styles.userText}>{entry.user_input}</Text>
              </View>
            </View>
          )}

          <View style={styles.botRow}>
            <View style={styles.botBubble}>
              <Text style={styles.botText}>{entry.response}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    paddingHorizontal: 16,
    flex: 1,
  },
  bubbleWrapper: {
    marginBottom: 16,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  botRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 4,
  },
  userBubble: {
    backgroundColor: "#E1AD63",
    padding: 12,
    borderRadius: 16,
    maxWidth: "80%",
    borderTopRightRadius: 0,
  },
  botBubble: {
    backgroundColor: "#F5E3B3",
    padding: 12,
    borderRadius: 16,
    maxWidth: "80%",
    borderTopLeftRadius: 0,
  },
  userText: {
    color: "#000",
    fontSize: 16,
  },
  botText: {
    color: "#000",
    fontSize: 16,
  },
});
