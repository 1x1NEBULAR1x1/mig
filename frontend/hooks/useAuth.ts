import {useState, useEffect} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Failed to load token from AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };
    loadToken().then();
  }, []);

  const saveToken = async (newToken: string) => {
    try {
      await AsyncStorage.setItem('userToken', newToken);
      setToken(newToken);
    } catch (error) {
      console.error('Failed to save token to AsyncStorage:', error);
    }
  };

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setToken(null);
    } catch (error) {
      console.error('Failed to remove token from AsyncStorage:', error);
    }
  };

  return {
    token,
    loading,
    saveToken,
    removeToken,
  };
};