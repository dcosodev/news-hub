import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useTheme } from 'next-themes';

interface TopStoryProps {
  story: {
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

const TopStory: React.FC<TopStoryProps> = ({ story }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff' }]}>
      <Image
        source={{ uri: story.image?.thumbnail?.contentUrl || 'https://via.placeholder.com/400x200' }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme === 'dark' ? '#ffffff' : '#000000' }]}>{story.name}</Text>
        <Text style={styles.category}>
          {story.category} • {new Date(story.datePublished).toLocaleDateString()}
        </Text>
        <Text style={[styles.description, { color: theme === 'dark' ? '#e0e0e0' : '#333333' }]}>{story.description}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL(story.url)}
        >
          <Text style={styles.buttonText}>Read Full Story</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TopStory;