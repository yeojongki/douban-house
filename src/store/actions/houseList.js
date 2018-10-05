import { GetHouseList } from '@/api';
import * as types from '../actionTypes/houseList';

// 请求房源
export const fetchHouseList = (
  page = 1,
  size = 30,
  filter = [],
  loadmore
) => dispatch => {
  // 设置loding打开
  dispatch({
    type: types.SET_LOADING,
    loading: { isLoading: true }
  });
  GetHouseList(page, size, filter)
    .then(res => {
      if (res && res.code === 1) {
        // 如果请求数<size 说明没有更多了
        if (res.data.length < size) {
          dispatch({
            type: types.SET_LOADING,
            loading: { hasMore: false }
          });
        }
        if (loadmore) {
          // 加载更多
          dispatch({
            type: types.LOADMORE_LIST,
            list: res.data
          });
        } else {
          // 正常获取
          dispatch({
            type: types.SET_HOUSE_LIST,
            list: res.data
          });
        }
        // 设置loding关闭
        dispatch({
          type: types.SET_LOADING,
          loading: { isLoading: false }
        });
      }
    })
    .catch(err => {
      console.error(err);
      dispatch({
        type: types.SET_LOADING,
        loading: {
          isLoading: false
        }
      });
    });
};

// 设置滚动列表高度
export const setScrollHeight = scrollHeight => ({
  type: types.SET_SCROLL_HEIGHT,
  scrollHeight
});

// 列表页数更改
export const changePage = page => ({
  type: types.CHANGE_PAGE,
  page
});

// 设置当前滚动条位置
export const setScrollTop = scrollTop => ({
  type: types.SET_SCROLL_TOP,
  scrollTop
});

// 设置搜索参数
export const setQuery = query => ({
  type: types.SET_QUERY,
  query
});

// 设置搜索菜单选择项
export const setSelectedMenu = selectedMenu => ({
  type: types.SET_SELECTED_MENU,
  selectedMenu
});
