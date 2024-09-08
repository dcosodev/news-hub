import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useTheme } from 'next-themes';

interface NewsCardProps {
  article: {
    name: string;
    url: string;
    image?: {
      thumbnail?: {
        contentUrl: string;
      };
    };
    category: string;
    datePublished: string;
    description: string;
  };
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff' }]}>
      <Image
        source={{ uri: article.image?.thumbnail?.contentUrl || 'https://via.placeholder.com/100x100' }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme === 'dark' ? '#ffffff' : '#000000' }]}>{article.name}</Text>
        <Text style={styles.category}>
          {article.category} • {new Date(article.datePublished).toLocaleDateString()}
        </Text>
        <Text style={[styles.description, { color: theme === 'dark' ? '#e0e0e0' : '#333333' }]} numberOfLines={2}>
          {article.description}
        </Text>
        <TouchableOpacity
          style={styles.readMore}
          onPress={() => Linking.openURL(article.url)}
        >
          <Text style={styles.readMoreText}>Read More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  readMore: {
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default NewsCard;