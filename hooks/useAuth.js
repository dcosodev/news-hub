import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    // Implement your login logic here
    // For now, we'll just simulate a successful login
    const user = { email, name: email.split('@')[0] };
    await AsyncStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const register = async (email, password) => {
    // Implement your registration logic here
    // For now, we'll just simulate a successful registration
    const user = { email, name: email.split('@')[0] };
    await AsyncStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return { user, login, register, logout };
};

export default useAuth;