import { Dimensions, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const emotionColorMap: Record<string, string> = {
  happy: "#ffef45",
  sad: "#a4d2ff",
  calm: "#63c263",
  angry: "#FF6347",
  neutral: "#D3D3D3",
  anxious: "#d8baf9",
};

const emotionLabelMap: Record<string, string> = {
  happy: "기쁨",
  sad: "슬픔",
  calm: "평온",
  angry: "분노",
  neutral: "무감정",
  anxious: "불안",
};

const getPieChartData = (counts: Record<string, number>) => {
  return Object.entries(counts)
    .filter(([_, count]) => count > 0)
    .map(([emotion, count]) => ({
      name: emotionLabelMap[emotion] || emotion,
      population: count,
      color: emotionColorMap[emotion],
      legendFontColor: "#333",
      legendFontSize: 16,
      legendFontFamily: "Cafe24Dongdong",
    }));
};

export default function PieChartComponent({
  emotionCounts,
}: {
  emotionCounts: Record<string, number>;
}) {
  const data = getPieChartData(emotionCounts);

  return (
    <View style={{ borderRadius: 15, overflow: "hidden" }}>
      <PieChart
        data={data}
        width={screenWidth - 60}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="#F5E3B3"
        paddingLeft="15"
      />
    </View>
  );
}
