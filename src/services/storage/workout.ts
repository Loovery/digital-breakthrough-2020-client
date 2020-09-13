import {IActionWorkoutData, IWorkout} from '../types';
import to from 'await-to-js';
import AsyncStorage from '@react-native-community/async-storage';
import CONFIG from '../../config';
import storage from './index';

export const getActionWorkout = async (workoutId: string): Promise<IWorkout | null> => {
  const [error, workout] = await to(AsyncStorage.getItem(CONFIG.STORAGE.ACTION_WORKOUT));
  if (error || !workout) {
    return await storage.getDefaultWorkout();
  }

  return JSON.parse(workout);
};

export const setActionWorkout = async (workout: IWorkout): Promise<void> => {
  await AsyncStorage.setItem(CONFIG.STORAGE.ACTION_WORKOUT, JSON.stringify(workout));
};

export const getActionWorkoutData = async (): Promise<IActionWorkoutData> => {
  const data = await AsyncStorage.getItem(CONFIG.STORAGE.ACTION_WORKOUT_DATA);
  return (data && JSON.parse(data)) || {currentIntervalIndex: 0, segments: [], durationMinutes: 0};
};

export const setActionWorkoutData = async (data: IActionWorkoutData): Promise<void> => {
  await AsyncStorage.setItem(CONFIG.STORAGE.ACTION_WORKOUT_DATA, JSON.stringify(data));
};

export const setActionWorkoutDataAttr = async (key: string, value: any): Promise<void> => {
  const data = await getActionWorkoutData();
  // @ts-ignore
  data[key] = value;
  await AsyncStorage.setItem(CONFIG.STORAGE.ACTION_WORKOUT_DATA, JSON.stringify(data));
};
