import to from 'await-to-js';
import AsyncStorage from '@react-native-community/async-storage';
import CONFIG from '../../config';
import {IWorkoutsList, IWorkout} from '../types';

const defaultId = '72d009ce-6cbf-4c20-a983-973484def86a';

export const defWorkout = async (): Promise<IWorkout> => {
  return await getDefaultWorkout();
};

export const getWorkouts = async () => {
  const [error, data] = await to(AsyncStorage.getItem(CONFIG.STORAGE.WORKOUTS));
  if (error) {
    return [];
  }

  const workouts: IWorkout[] = JSON.parse(data as string) || [];

  return workouts;
};

export const getWorkout = async (workoutId: string): Promise<IWorkout | undefined> => {
  const data = await getWorkouts();
  return data.find((workout: IWorkout) => workout._id === workoutId);
};

export const setWorkouts = async (workouts: IWorkout[]) => {
  const [error] = await to(AsyncStorage.setItem(CONFIG.STORAGE.WORKOUTS, JSON.stringify(workouts)));
  return !error;
};

export const setDefaultWorkout = async (workout: IWorkout) => {
  const [error] = await to(AsyncStorage.setItem(CONFIG.STORAGE.WORKOUTS_DEFAULT, JSON.stringify(workout)));
  return !error;
};

export const getDefaultWorkout = async (): Promise<IWorkout> => {
  const [error, workout] = await to(AsyncStorage.getItem(CONFIG.STORAGE.WORKOUTS_DEFAULT));
  return (!error && workout && JSON.parse(workout)) || undefined;
};

export const getMyListWorkouts = async () => {
  const initLists: IWorkoutsList[] = [];

  const [error, data] = await to(AsyncStorage.getItem(CONFIG.STORAGE.MY_LISTS_WORKOUTS));
  if (error) {
    return initLists;
  }
  const lists: IWorkoutsList[] = JSON.parse(data as string) || [];

  return initLists.concat(lists);
};

export const setMyListWorkouts = async (lists: IWorkoutsList) => {
  const [error] = await to(AsyncStorage.setItem(CONFIG.STORAGE.MY_LISTS_WORKOUTS, JSON.stringify(lists)));
  return !error;
};

export const getMyListWorkoutsSelected = async () => {
  const [error, selected] = await to(AsyncStorage.getItem(CONFIG.STORAGE.MY_LISTS_WORKOUTS_SELECTED));
  if (error || !selected) {
    return defaultId;
  }
  return selected;
};

export const setMyListWorkoutsSelected = async (listsId: string) => {
  const [error] = await to(AsyncStorage.setItem(CONFIG.STORAGE.MY_LISTS_WORKOUTS_SELECTED, listsId));
  return !error;
};
