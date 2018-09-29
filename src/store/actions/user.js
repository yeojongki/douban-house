import * as types from '../actionTypes/user';

// 设置user信息
export const setUser = user => ({
  type: types.SET_USER,
  user: user
});

// 登出
export const logout = () => ({
  type: types.LOG_OUT
});
