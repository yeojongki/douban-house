import * as types from '../actionTypes/tab';

// 设置当前tab
export const setActiveTab = tab => ({
  type: types.SET_ACTIVE_TAB,
  tab
});
