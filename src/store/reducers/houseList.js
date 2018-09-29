import * as types from '../actionTypes/houseList';

const defaultState = {
  list: null,
  page: 1,
  size: 30,
  height: null,
  scrollTop: null,
  loading: {
    hasMore: true,
    refreshing: false,
    isLoading: false
  }
};

export default (state = defaultState, action) => {
  switch (action.type) {
    // 设置loading
    case types.SET_LOADING:
      return { ...state, loading: { ...state.loading, ...action.loading } };
    // 设置房源列表
    case types.SET_HOUSE_LIST:
      return { ...state, list: action.list };
    // 设置滚动高度
    case types.SET_SCROLL_HEIGHT:
      return { ...state, height: action.height };
    // 设置页码
    case types.CHANGE_PAGE:
      return { ...state, page: action.page };
    // 加载更多房源
    case types.LOADMORE_LIST:
      return {
        ...state,
        list: state.list.concat(action.list),
        filter: action.filter
      };
    // 设置滚动条当前位置
    case types.SET_SCROLL_TOP:
      return { ...state, scrollTop: action.scrollTop }

    default:
      return state;
  }
};
