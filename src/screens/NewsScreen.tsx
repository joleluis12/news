import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  content: string;
};

// API functions dentro del mismo archivo (temporal)
const API_KEY = "c5e412cb60184a9cbe1e6bddc98dddd0";
const BASE_URL = "https://newsapi.org/v2";

const getNewsSimple = async (): Promise<Article[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/top-headlines?country=us&pageSize=10&apiKey=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (!data.articles) return [];

    return data.articles
      .filter((article: any) => 
        article.title && 
        article.title !== '[Removed]' && 
        article.description
      )
      .map((article: any) => ({
        title: article.title || "Sin título",
        description: article.description || "Sin descripción",
        url: article.url || "#",
        urlToImage: article.urlToImage || 'https://via.placeholder.com/300',
        content: article.content || article.description
      }))
      .slice(0, 6);
      
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

const NewsScreen: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const news = await getNewsSimple();
        setArticles(news);
      } catch (error) {
        console.error("Error loading news:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const renderNewsItem = ({ item }: { item: Article }) => (
    <TouchableOpacity style={styles.newsCard}>
      <Image 
        source={{ uri: item.urlToImage }} 
        style={styles.newsImage}
        defaultSource={{ uri: 'https://via.placeholder.com/300' }}
      />
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando noticias...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Últimas Noticias</Text>
      <FlatList
        data={articles}
        renderItem={renderNewsItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  newsCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  newsImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  newsContent: {
    padding: 12,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default NewsScreen;