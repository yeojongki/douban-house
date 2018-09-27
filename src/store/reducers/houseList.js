import * as types from '../actionTypes/houseList';

const defaultState = {
  list: [],
  page: 1,
  size: 30,
  height: null,
  loading: {
    hasMore: true,
    refreshing: false,
    isLoading: false
  }
};

export default (state = defaultState, action) => {
  switch (action.type) {
    // set loading
    case types.SET_LOADING:
      return Object.assign({}, state, {
        loading: { ...state.loading, ...action.loading }
      });
    // houseList
    case types.SET_HOUSE_LIST:
      return Object.assign({}, state, {
        list: action.list
      });
    // set scroll height
    case types.SET_SCROLL_HEIGHT:
      return Object.assign({}, state, { height: action.height });
    // set page
    case types.CHANGE_PAGE:
      return Object.assign({}, state, { page: action.page });
    // loadmore list
    case types.LOADMORE_LIST:
      console.log('loadmore');
      return Object.assign({}, state, {
        list: state.list.concat(action.list),
        filter: action.filter
      });

    default:
      return state;
  }
};
