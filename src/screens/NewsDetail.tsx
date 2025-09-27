import * as React from "react";
import { View, Text, Image, ScrollView, StyleSheet, Linking, Button } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useTheme } from "../context/ThemeContext";

type NewsDetailRouteProp = RouteProp<RootStackParamList, "NewsDetail">;

export default function NewsDetail({ route }: { route: NewsDetailRouteProp }) {
  const { article } = route.params;
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {article.urlToImage && (
        <Image source={{ uri: article.urlToImage }} style={styles.image} />
      )}
      <Text style={[styles.title, { color: colors.text }]}>{article.title}</Text>
      <Text style={[styles.content, { color: colors.text }]}>
        {article.content || article.description}
      </Text>
      {article.url && (
        <Button color={colors.accent} title="Read more" onPress={() => Linking.openURL(article.url)} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  image: { width: "100%", height: 200, borderRadius: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginVertical: 10 },
  content: { fontSize: 16, marginBottom: 20 },
});
