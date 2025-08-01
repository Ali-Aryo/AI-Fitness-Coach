import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = '@auth_token';
const USER_DATA_KEY = '@user_data';

export const authPersistence = {
  // Save authentication token
  async saveAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving auth token:', error);
    }
  },

  // Get authentication token
  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  // Save user data
  async saveUserData(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },

  // Get user data
  async getUserData(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Clear all authentication data
  async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      return token !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }
}; 