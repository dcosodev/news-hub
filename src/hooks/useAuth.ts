import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface User {
  email: string;
  name: string;
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  const isWeb = Platform.OS === 'web';

  const getItem = async (key: string): Promise<string | null> => {
    if (isWeb) {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  };

  const setItem = async (key: string, value: string): Promise<void> => {
    if (isWeb) {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  };

  const removeItem = async (key: string): Promise<void> => {
    if (isWeb) {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    // Implement your login logic here
    // For now, we'll just simulate a successful login
    const user = { email, name: email.split('@')[0] };
    await setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const register = async (email: string, password: string) => {
  
    const user = { email, name: email.split('@')[0] };
    await setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = async () => {
    await removeItem('user');
    setUser(null);
  };

  return { user, login, register, logout };
};

export default useAuth;
