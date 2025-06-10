import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const categories = ["책", "영화", "음악", "글귀"];

export default function Recommend() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("책");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelect = (category: string) => {
    setSelectedCategory(category);
  };

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
            {categories.map((category) => (
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
          <Text style={styles.detailText}>
            추천 {selectedCategory} 콘텐츠 보여주는 곳
          </Text>
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
    alignItems: "center",
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
