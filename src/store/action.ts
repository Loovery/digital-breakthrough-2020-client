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
    //
    // videoList.forEach((video) => {
    //   if (video.name.toLowerCase().indexOf('gin') > -1 || video.name.toLowerCase().indexOf('beer') > -1 || video.name.toLowerCase().indexOf('vodka') > -1) {
    //     video.status = 'notTrust';
    //   } else {
    //     video.status = 'trust';
    //   }
    // });

    // await storage.setVideoList(videoList);

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

        // Не было время придумывать изысканное решение
        data.forEach((item: IVideo) => {
          videos.forEach((video: IVideo) => {
            if (item.id === video.id) {
              video.status = item.status;
            }
          });
        });

        storage.setVideoList(videos);

        dispatch({type: types.GET_VIDEO_LIST, videoList: videos});
      }
    };

    await refresh();
    setInterval(refresh, 30000);
  };
};
