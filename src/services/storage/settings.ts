import AsyncStorage from '@react-native-community/async-storage';
import CONFIG from '../../config';
import {ISettingsReducer, ISettingsGeneral, ISettingsSystem, ISettingsWorkout} from '../types';
import to from 'await-to-js';

const defaultSettingsWorkout = {
  ftp: 100,
  hr: 140,
  ergStep: 10,
  freeRideStep: 3,
};

export const getSettingsWorkout = async (): Promise<ISettingsWorkout> => {
  const [error, settingsWorkout] = await to(AsyncStorage.getItem(CONFIG.STORAGE.SETTINGS_WORKOUT));

  if (error) {
    return defaultSettingsWorkout;
  }

  return JSON.parse(settingsWorkout as string) || defaultSettingsWorkout;
};

export const editSettingsWorkout = async (key: 'ftp' | 'hr' | 'ergStep' | 'freeRideStep', value: number) => {
  const settingsWorkout = await getSettingsWorkout();
  settingsWorkout[key] = value;

  await saveSettingsWorkout(settingsWorkout);
};

export const saveSettingsWorkout = async (settingsWorkout: ISettingsWorkout): Promise<boolean> => {
  const [error] = await to(AsyncStorage.setItem(CONFIG.STORAGE.SETTINGS_WORKOUT, JSON.stringify(settingsWorkout)));
  return !error;
};

const defaultSettingsGeneral = {};

export const getSettingsGeneral = async (): Promise<ISettingsGeneral> => {
  const [error, settingsGeneral] = await to(AsyncStorage.getItem(CONFIG.STORAGE.SETTINGS_GENERAL));

  if (error) {
    return defaultSettingsGeneral;
  }

  return JSON.parse(settingsGeneral as string) || defaultSettingsGeneral;
};

export const saveSettingsGeneral = async (settingsGeneral: ISettingsGeneral): Promise<boolean> => {
  const [error] = await to(AsyncStorage.setItem(CONFIG.STORAGE.SETTINGS_GENERAL, JSON.stringify(settingsGeneral)));
  return !error;
};

const defaultSettingsSystem = {
  hasMessageAutoExtendBeenShown: false,
  isHiddenPopupSetFtp: false,
  isAutoExtendCooldown: true,
  isStartOnTrainingTab: false,
  isFirstAppStart: true,
  isFirstStartAfterSubscription: true,
  hasUserSubscription: false,
  isTotalIndicationDown: true,
  isIntervalIndicationDown: true,
};

export const getSettingsSystem = async (): Promise<ISettingsSystem> => {
  const [error, settingsSystem] = await to(AsyncStorage.getItem(CONFIG.STORAGE.SETTINGS_SYSTEM));

  if (error) {
    return defaultSettingsSystem;
  }

  return JSON.parse(settingsSystem as string) || defaultSettingsSystem;
};

export const saveSettingsSystem = async (settingsSystem: ISettingsSystem): Promise<boolean> => {
  const [error] = await to(AsyncStorage.setItem(CONFIG.STORAGE.SETTINGS_SYSTEM, JSON.stringify(settingsSystem)));
  return !error;
};

export const editSettingsSystem = async (key: string, value: any): Promise<boolean> => {
  const settingsSystem = await getSettingsSystem();
  // @ts-ignore
  settingsSystem[key] = value;

  const [error] = await to(AsyncStorage.setItem(CONFIG.STORAGE.SETTINGS_SYSTEM, JSON.stringify(settingsSystem)));
  return !error;
};

export const getSettings = async (): Promise<ISettingsReducer> => {
  const settingsWorkout = await getSettingsWorkout();
  const settingsGeneral = await getSettingsGeneral();
  const settingsSystem = await getSettingsSystem();

  return {
    general: settingsGeneral,
    workout: settingsWorkout,
    system: settingsSystem,
  };
};
