import * as types from '../actionTypes/tab';

const defaultState = {
  tab: 'listTab'
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.SET_ACTIVE_TAB:
      return { ...state, tab: action.tab };
    default:
      return state;
  }
};
