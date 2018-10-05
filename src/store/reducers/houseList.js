import * as types from '../actionTypes/houseList';
import { Toast } from 'antd-mobile';

const defaultState = {
  list: null,
  page: 1,
  size: 30,
  scrollHeight: null,
  scrollTop: null,
  loading: {
    hasMore: true,
    refreshing: false,
    isLoading: false
  },
  query: {},
  selectedMenu: []
};

export default (state = defaultState, action) => {
  switch (action.type) {
    // 设置loading
    case types.SET_LOADING:
      if (action.loading.isLoading) {
        Toast.loading('加载中', 0);
      }
      if (action.loading.isLoading === false) {
        Toast.hide();
      }
      return { ...state, loading: { ...state.loading, ...action.loading } };
    // 设置房源列表
    case types.SET_HOUSE_LIST:
      return { ...state, list: action.list };
    // 设置滚动高度
    case types.SET_SCROLL_HEIGHT:
      return { ...state, scrollHeight: action.scrollHeight };
    // 设置页码
    case types.CHANGE_PAGE:
      return { ...state, page: action.page };
    // 加载更多房源
    case types.LOADMORE_LIST:
      return {
        ...state,
        list: state.list.concat(action.list)
      };
    // 设置滚动条当前位置
    case types.SET_SCROLL_TOP:
      return { ...state, scrollTop: action.scrollTop };
    // 设置查询参数
    case types.SET_QUERY:
      return { ...state, query: action.query };
    // 设置搜索菜单选择项
    case types.SET_SELECTED_MENU:
      return { ...state, selectedMenu: action.selectedMenu };

    default:
      return state;
  }
};
