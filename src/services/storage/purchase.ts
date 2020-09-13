import {IPurchase} from '../types';
import to from 'await-to-js';
import AsyncStorage from '@react-native-community/async-storage';
import CONFIG from '../../config';

const defaultPlan = {plan: 'none'};

export const getPurchase = async (): Promise<IPurchase> => {
  const [error, data] = await to(AsyncStorage.getItem(CONFIG.STORAGE.PURCHASE));

  if (error) {
    return defaultPlan;
  }

  return JSON.parse(data as string) || defaultPlan;
};

export const setPurchase = async (data: IPurchase): Promise<void> => {
  await AsyncStorage.setItem(CONFIG.STORAGE.PURCHASE, JSON.stringify(data));
};

export const getStorePlan = async (): Promise<string> => {
  return (await getPurchase()).plan;
};

export const setStorePlan = async (storePlan: any): Promise<void> => {
  const data = await getPurchase();
  data.plan = storePlan;
  await setPurchase(data);
};
