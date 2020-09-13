import to from 'await-to-js';
import AsyncStorage from '@react-native-community/async-storage';
import CONFIG from '../../config';

export const getAccessToken = async () => {
  const initAccessToken = {
    token: null,
  };

  const [error, token] = await to(AsyncStorage.getItem(CONFIG.STORAGE.TOKEN));
  if (error) {
    return initAccessToken;
  }

  return JSON.parse(token as string) || initAccessToken;
};

export const setAccessToken = async (token: string | null) => {
  const [error] = await to(AsyncStorage.setItem(CONFIG.STORAGE.TOKEN, JSON.stringify({token})));
  return !error;
};
