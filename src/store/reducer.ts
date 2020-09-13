import types from './types';

export interface IVideo {
  id: string;
  name: string;
  status: string;
}

export interface IReducer {
  userId: string;
  videoList: IVideo[];
}

interface IAction {
  type: string;
  userId: string;
  videoList: IVideo[];
}

const initialState: IReducer = {
  userId: '',
  videoList: [],
};

export default (state: IReducer = initialState, action: IAction) => {
  switch (action.type) {
    case types.USER_ID:
      return {
        ...state,
        userId: action.userId,
      };
    case types.GET_VIDEO_LIST:
      return {
        ...state,
        videoList: action.videoList,
      };
    case types.CHANGED_STATUS:
      return {
        ...state,
        videoList: action.videoList,
      };
    default:
      return state;
  }
};
