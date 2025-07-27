import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Recommend() {
  const router = useRouter();
  const { emotion: passedEmotion } = useLocalSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("책");
  const [showDropdown, setShowDropdown] = useState(false);
  const [recommendations, setRecommendations] = useState<
    { title: string; url: string; emotion_tags: string; image?: string }[]
  >([]);
  const [emotion, setEmotion] = useState<string>(
    typeof passedEmotion === "string" ? passedEmotion : ""
  );
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  console.log("🔵 전달된 감정:", passedEmotion);

  const handleSelect = (category: string) => {
    setSelectedCategory(category);
  };

  const fetchRecommendations = async (emotion: string) => {
    if (!emotion) {
      console.log("⚠️ 감정 없음: 추천 요청하지 않음");
      setRecommendations([]);
      setAvailableCategories([]);
      return;
    }
    try {
      const response = await fetch(
        `https://gamja-friend.onrender.com/api/recommend?emotion=${encodeURIComponent(
          emotion
        )}`
      );
      const data = await response.json();
      console.log("📟 응답 상태 코드:", response.status);
      console.log("📥 응답 전체 데이터:", data);

      // 카테고리 키 매핑
      const categoryMap: { [key: string]: string } = {
        책: "books",
        영화: "movies",
        음악: "music",
        글귀: "quotes",
      };

      // 사용 가능한 카테고리 필터링
      const available = Object.entries(categoryMap)
        .filter(([kor, key]) => data[key] && data[key].length > 0)
        .map(([kor]) => kor);
      setAvailableCategories(available);

      // 기존 selectedCategory 처리
      const categoryKey = categoryMap[selectedCategory];
      setRecommendations(data[categoryKey] ?? []);
      if (categoryKey && data[categoryKey]) {
        console.log("✅ 추천 콘텐츠 받아옴:", data[categoryKey]);
      }
    } catch (error) {
      console.error("추천 콘텐츠 로딩 실패:", error);
      setAvailableCategories([]);
    }
  };

  useEffect(() => {
    fetchRecommendations(emotion);
  }, [selectedCategory, emotion]);

  useEffect(() => {
    if (
      availableCategories.length > 0 &&
      !availableCategories.includes(selectedCategory)
    ) {
      setSelectedCategory(availableCategories[0]);
    }
  }, [availableCategories]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backButtonWrapper}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#63411F" />
          </Pressable>
        </View>
        <View style={styles.headerTitleWrapper}>
          <Text style={styles.title}>추천 컨텐츠</Text>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: 30,
          marginBottom: 20,
          position: "relative",
        }}
      >
        <Text style={styles.subtitle}>어떤 컨텐츠를 추천받고 싶으신가요?</Text>
        <Pressable
          style={styles.dropdownToggle}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.dropdownText}>
            {selectedCategory.charAt(0).toUpperCase() +
              selectedCategory.slice(1)}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#63411F" />
        </Pressable>
        {showDropdown && (
          <View style={styles.dropdownMenu}>
            {availableCategories.map((category) => (
              <Pressable
                key={category}
                onPress={() => {
                  setSelectedCategory(category);
                  setShowDropdown(false);
                }}
              >
                <Text style={styles.dropdownItem}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      {selectedCategory && (
        <View style={styles.detailContainer}>
          {recommendations.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 8,
              }}
            >
              {item.image && (
                <View style={{ marginRight: 8 }}>
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 50, height: 75, borderRadius: 4 }}
                  />
                </View>
              )}
              <View style={{ flexShrink: 1 }}>
                <Text
                  style={{
                    fontFamily: "Cafe24Dongdong",
                    color: "#63411F",
                    fontSize: 20,
                    marginBottom: 2,
                  }}
                >
                  • {item.title}
                </Text>
                <Text
                  style={{
                    fontFamily: "Cafe24Dongdong",
                    color: "#a86f2d",
                    fontSize: 14,
                  }}
                >
                  {item.emotion_tags}
                </Text>
                {item.url && (
                  <Pressable onPress={() => Linking.openURL(item.url)}>
                    <Ionicons name="link-outline" size={18} color="#63411F" />
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7E0",
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
    position: "relative",
  },
  backButtonWrapper: {
    width: 40,
  },
  headerTitleWrapper: {
    flex: 1,
    alignItems: "center",
    marginRight: 40, // match backButtonWrapper width
  },
  title: {
    fontSize: 24,
    fontFamily: "Cafe24Dongdong",
    color: "#63411F",
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Cafe24Dongdong",
    color: "#63411F",
    marginLeft: 10,
    marginBottom: 20,
  },
  detailContainer: {
    paddingLeft: 30,
    paddingTop: 10,
  },
  detailText: {
    fontSize: 20,
    marginBottom: 20,
  },
  dropdownToggle: {
    width: 330,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#63411F",
    borderRadius: 8,
    backgroundColor: "#F5E3B3",
  },
  dropdownText: {
    fontSize: 18,
    color: "#63411F",
    fontFamily: "Cafe24Dongdong",
  },
  dropdownMenu: {
    width: 330,
    marginTop: 90,
    marginLeft: 30,
    backgroundColor: "#FFF7E0",
    borderWidth: 1,
    borderColor: "#63411F",
    borderRadius: 8,
    overflow: "hidden",
    position: "absolute",
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 18,
    fontFamily: "Cafe24Dongdong",
    color: "#63411F",
  },
});
