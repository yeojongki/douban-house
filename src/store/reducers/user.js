import * as types from '../actionTypes/user';
import Cookie from 'js-cookie';

const defaultState = {
  username: Cookie.get('username') || '',
  token: Cookie.get('token') || ''
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.SET_USER:
      return { ...state, ...action.user };
    case types.LOG_OUT:
      return { ...state, username: '', token: '' };
    default:
      return state;
  }
};
