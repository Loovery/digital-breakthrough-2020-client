import axios from '../axios';
import config from '../../config';
import to from 'await-to-js';

const upload = async (data: any) => {
  const [error] = await to(axios.post(config.uploadVideo, data));

  if (error) {
    throw error;
  }

  return true;
};

const getList = async () => {
  const [error, res] = await to(axios.get(config.getList));

  if (error || !res) {
    throw error;
  }

  return res.data;
};

export default {
  upload,
  getList,
};
