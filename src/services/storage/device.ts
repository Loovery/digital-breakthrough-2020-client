import AsyncStorage from '@react-native-community/async-storage';
import CONFIG from '../../config';
import {IDevice, IDevices} from '../types';
import to from 'await-to-js';

export const getDevices = async (): Promise<IDevices> => {
  const [error, devices] = await to(AsyncStorage.getItem(CONFIG.STORAGE.DEVICES));

  if (error) {
    return {};
  }

  return JSON.parse(devices as string) || {};
};

export const setDevices = async (devices: IDevices): Promise<boolean> => {
  const [error] = await to(AsyncStorage.setItem(CONFIG.STORAGE.DEVICES, JSON.stringify(devices)));
  return !error;
};

export const getDevice = async (deviceId: string): Promise<IDevice | undefined> => {
  const [, devices] = await to(getDevices());
  return devices && devices[deviceId];
};

export const addDevice = async (deviceId: string, device: IDevice) => {
  const devices = await getDevices();
  devices[deviceId] = device;
  return await to(setDevices(devices));
};

export const removeDevice = async (deviceId: string) => {
  const devices = await getDevices();
  delete devices[deviceId];
  return await setDevices(devices);
};
