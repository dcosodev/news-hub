'use client'

import React, { useState, useEffect } from "react"
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { ThemeProvider, useTheme } from "next-themes"
import { SunIcon, MoonIcon, MenuIcon, SearchIcon, UserIcon } from "lucide-react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { fetchCategories, fetchNewsByCategory } from '../src/services/newsApi'
import useAuth from '../src/hooks/useAuth'
import TopStory from '../src/components/TopStory'
import NewsCard from '../src/components/NewsCard'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <TouchableOpacity
      style={styles.iconButton}
      onPress={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? <MoonIcon style={styles.icon} /> : <SunIcon style={styles.icon} />}
    </TouchableOpacity>
  )
}

function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, register } = useAuth()

  const handleSubmit = async () => {
    if (isLogin) {
      await login(email, password)
    } else {
      await register(email, password)
    }
    onClose()
  }

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay style={styles.modalOverlay} />
        <DialogPrimitive.Content style={styles.modalContent}>
          <DialogPrimitive.Title style={styles.modalTitle}>
            {isLogin ? 'Login' : 'Register'}
          </DialogPrimitive.Title>
          <View style={styles.form}>
            <Text>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
            <Text>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>{isLogin ? 'Login' : 'Register'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setIsLogin(!isLogin)}
            style={styles.switchModeButton}
          >
            <Text style={styles.switchModeText}>
              {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

function NewsPage() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [topStory, setTopStory] = useState(null)
  const [news, setNews] = useState([])
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      loadNews(selectedCategory)
    }
  }, [selectedCategory])

  const loadCategories = async () => {
    try {
      const fetchedCategories = await fetchCategories()
      setCategories(fetchedCategories)
      if (fetchedCategories.length > 0) {
        setSelectedCategory(fetchedCategories[0])
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadNews = async (category) => {
    setIsLoading(true)
    try {
      const fetchedNews = await fetchNewsByCategory(category)
      if (fetchedNews.length > 0) {
        setTopStory(fetchedNews[0])
        setNews(fetchedNews.slice(1))
      }
    } catch (error) {
      console.error('Error loading news:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <View style={styles.loadingContainer}><Text>Loading...</Text></View>
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff' }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <MenuIcon style={styles.icon} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme === 'dark' ? '#ffffff' : '#000000' }]}>NewsHub</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <SearchIcon style={styles.icon} />
          </TouchableOpacity>
          {user ? (
            <TouchableOpacity onPress={logout} style={styles.textButton}>
              <Text style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>Logout</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setIsAuthModalOpen(true)} style={styles.iconButton}>
              <UserIcon style={styles.icon} />
            </TouchableOpacity>
          )}
          <ThemeToggle />
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.selectedCategoryText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView>
        {topStory && <TopStory story={topStory} />}
        <View style={styles.latestNews}>
          <Text style={[styles.latestNewsTitle, { color: theme === 'dark' ? '#ffffff' : '#000000' }]}>Latest News</Text>
          {news.map((article) => (
            <NewsCard key={article.url} article={article} />
          ))}
        </View>
      </ScrollView>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
  textButton: {
    padding: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  categoriesContainer: {
    padding: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  latestNews: {
    padding: 16,
  },
  latestNewsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  form: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchModeButton: {
    alignItems: 'center',
  },
  switchModeText: {
    color: '#007AFF',
  },
});

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NewsPage />
    </ThemeProvider>
  )
}