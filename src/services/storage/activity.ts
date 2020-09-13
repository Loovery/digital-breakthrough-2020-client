import AsyncStorage from '@react-native-community/async-storage';
import CONFIG from '../../config';
import {IActivity, IActivities, IWorkout} from '../types';
import to from 'await-to-js';

export const getActivities = async (): Promise<IActivities> => {
  const [error, activities] = await to(AsyncStorage.getItem(CONFIG.STORAGE.ACTIVITIES));

  if (error) {
    return {};
  }

  return JSON.parse(activities as string) || {};
};

export const setActivities = async (activities: IActivities): Promise<boolean> => {
  const [error] = await to(AsyncStorage.setItem(CONFIG.STORAGE.ACTIVITIES, JSON.stringify(activities)));
  return !error;
};

export const getActivity = async (activityId: string): Promise<IActivity | undefined> => {
  const [, activities] = await to(getActivities());
  return activities && activities[activityId];
};

export const appendActivities = async (activity: IActivity, _id?: string) => {
  const activities = await getActivities();
  const id = _id || activity._id || activity.activityId;
  activities[id] = activity;
  const [, result] = await to(setActivities(activities));
  return result;
};

export const setAttrActivity = async (activityId: string, key: string, value: any) => {
  const activities = await getActivities();

  // @ts-ignore
  activities[activityId][key] = value;
  const [, result] = await to(setActivities(activities));
  return result;
};

export const removeActivities = async (activityId: string) => {
  const activities = await getActivities();
  delete activities[activityId];

  await setActivities(activities);
};

export const removeAllActivities = async () => {
  const activities = await getActivities();
  const buffer: {[key: string]: IActivity} = {};
  for (const id in activities) {
    if (!activities[id]._id) {
      buffer[id] = activities[id];
    }
  }

  await setActivities(buffer);
};

export const getBackupActivity = async (): Promise<any> => {
  const [error, data] = await to(AsyncStorage.getItem(CONFIG.STORAGE.ACTIVITY_BACKUP));

  if (error) {
    return null;
  }

  return JSON.parse(data as string) || null;
};

export const setBackupActivity = async (data: {
  values: any;
  workout: IWorkout;
  currentSeconds: number;
  timeInCurrentInterval: number;
  currentIntervalIndex: number;
  isTestMode: boolean;
}): Promise<boolean> => {
  const [error] = await to(AsyncStorage.setItem(CONFIG.STORAGE.ACTIVITY_BACKUP, JSON.stringify(data)));
  return !error;
};

export const clearBackupActivity = async (): Promise<boolean> => {
  const [error] = await to(AsyncStorage.removeItem(CONFIG.STORAGE.ACTIVITY_BACKUP));
  return !error;
};
