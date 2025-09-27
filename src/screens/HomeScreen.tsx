import * as React from "react";
import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { getTopHeadlines, searchNews, Article } from "../api/newsApi";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useTheme } from "../context/ThemeContext";
import NewsCard from "../components/NewsCard";

type HomeNavProp = StackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: { navigation: HomeNavProp }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { colors, toggleTheme, theme } = useTheme();

  useEffect(() => {
    const loadNews = async () => {
      const news = await getTopHeadlines();
      setArticles(news);
      setFilteredArticles(news);
      setLoading(false);
    };
    loadNews();
  }, []);

  const handleSearch = async (text: string) => {
    setSearchQuery(text);

    if (text.trim() === "") {
      setFilteredArticles(articles);
      return;
    }

    const localResults = articles.filter(article =>
      article.title.toLowerCase().includes(text.toLowerCase()) ||
      article.description.toLowerCase().includes(text.toLowerCase())
    );

    if (localResults.length > 0) {
      setFilteredArticles(localResults);
    } else {
      setLoading(true);
      const apiResults = await searchNews(text);
      setFilteredArticles(apiResults);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 🔹 Header */}
      <Text style={[styles.header, { color: colors.text }]}>Últimas Noticias</Text>

      {/* 🔹 Botón de cambiar tema */}
      <TouchableOpacity
        style={[styles.themeButton, { backgroundColor: colors.accent }]}
        onPress={toggleTheme}
      >
        <Text style={styles.themeButtonText}>
          {theme === "light" ? "Modo Oscuro" : "Modo Claro"}
        </Text>
      </TouchableOpacity>

      {/* 🔹 Buscador */}
      <TextInput
        style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Buscar noticias..."
        placeholderTextColor={colors.text + "99"}
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* 🔹 Lista de noticias */}
      <FlatList
        data={filteredArticles}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <NewsCard
            article={item}
            onPress={() => navigation.navigate("NewsDetail", { article: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchInput: {
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  themeButton: {
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  themeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
