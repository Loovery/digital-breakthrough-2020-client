import types from './types';
import to from 'await-to-js';
import storage from '../services/storage';
import api from '../services/api';
import {IVideo} from './reducer';

export const initApp = () => {
  return async (dispatch: any, getState: Function) => {
    const userId = await storage.getUserId();
    dispatch({type: types.USER_ID, userId});

    getList()(dispatch, getState);
    await getVideoList()(dispatch);

    return Promise.resolve();
  };
};

export const getVideoList = () => {
  return async (dispatch: any) => {
    const videoList = await storage.getVideoList();


    dispatch({type: types.GET_VIDEO_LIST, videoList});

    return Promise.resolve();
  };
};

export const addVideo = (id: string, name: string) => {
  return async (dispatch: any, getState: Function) => {
    storage.setVideoItem(id, name);

    const {videoList} = getState();
    videoList.push({id, name, status: 'moderation'});

    dispatch({type: types.GET_VIDEO_LIST, videoList});
  };
};

export const getList = () => {
  return async (dispatch: any, getState: Function) => {
    const refresh = async () => {
      const [error, data] = await to(api.getList());

      if (!error && typeof data === 'object') {
        const {videoList} = getState();
        const videos = videoList || (await storage.getVideoList());

        videos.forEach((video: IVideo) => {
          if (data.hasOwnProperty(video.id)) {
            video.status = data[video.id];
          }
        });

        storage.setVideoList(videos);

        dispatch({type: types.GET_VIDEO_LIST, videoList: videos});
      }
    };

    await refresh();
    setInterval(refresh, 10000);
  };
};
