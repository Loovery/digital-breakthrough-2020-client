import axios from '../axios';
import config from '../../config';
import to from 'await-to-js';
import storage from '../storage';

const upload = async (data: any) => {
  const [error] = await to(axios.post(config.uploadVideo, data));

  if (error) {
    throw error;
  }

  return true;
};

const getList = async () => {
  const userId = await storage.getUserId();
  const data = {userId};

  const [error, res] = await to(axios.post(config.getList, data));

  if (error || !res) {
    throw error;
  }

  return res.data;
};

export default {
  upload,
  getList,
};
