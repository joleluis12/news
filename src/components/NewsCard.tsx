import * as React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Article } from "../api/newsApi";
import { useTheme } from "../context/ThemeContext";

type Props = {
  article: Article;
  onPress: () => void;
};

export default function NewsCard({ article, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} onPress={onPress}>
      {article.urlToImage && (
        <Image source={{ uri: article.urlToImage }} style={styles.image} />
      )}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {article.title}
        </Text>
        {article.description && (
          <Text style={[styles.desc, { color: colors.text }]} numberOfLines={3}>
            {article.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: { width: "100%", height: 200 },
  textContainer: { padding: 10 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  desc: { fontSize: 14 },
});
