import AsyncStorage from '@react-native-community/async-storage';
import {uuid} from '../../utils/uuid';
import {IVideo} from '../../store/reducer';

const fields = {
  userId: '@user-id',
  listVideo: '@list-video',
};

const getUserId = async () => {
  let userId = await AsyncStorage.getItem(fields.userId);

  if (!userId) {
    userId = uuid();
    setUserId(userId);
  }

  return userId;
};

const setUserId = (userId: string) => {
  AsyncStorage.setItem(fields.userId, userId);
};

const getVideoList = async () => {
  const videos = await AsyncStorage.getItem(fields.listVideo);
  return JSON.parse(videos || '[]');
};

const setVideoList = async (videos: IVideo[]) => {
  AsyncStorage.setItem(fields.listVideo, JSON.stringify(videos));
};

const getVideoIndex = async (id: string, videos?: any[]) => {
  videos = videos || (await getVideoList());
  let index = 0;

  videos &&
    videos.find((item, i) => {
      if (id === item.id) {
        index = i;
        return true;
      }

      return false;
    });

  return index;
};

const setVideoItem = async (
  id: string,
  name: string,
  status: string = 'moderation',
) => {
  const videos = await getVideoList();
  videos.push({id, name, status});

  AsyncStorage.setItem(fields.listVideo, JSON.stringify(videos));
};

const changeStatusVideo = async (id: string, status: string) => {
  const videos = await getVideoList();
  const index = await getVideoIndex(id, videos);
  videos[index].status = status;

  console.log('change status');
  AsyncStorage.setItem(fields.listVideo, JSON.stringify(videos));
};

const storage = {
  getUserId,
  setUserId,
  getVideoList,
  setVideoList,
  setVideoItem,
  changeStatusVideo,
};

export default storage;
