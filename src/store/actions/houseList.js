import { GetHouseList } from '@/api';
import * as types from '../actionTypes/houseList';

// ajax get house list
export const fetchHouseList = (page = 1, size = 30, filter = [], loadmore) => {
  return dispatch => {
    dispatch({
      type: types.SET_LOADING,
      loading: { isLoading: true }
    });
    GetHouseList(page, size, filter)
      .then(res => {
        if (res && res.code === 1) {
          if (res.data.length < size) {
            dispatch({
              type: types.SET_LOADING,
              loading: { hasMore: false }
            });
          }
          // loadmore or init
          if (!loadmore) {
            dispatch({
              type: types.SET_HOUSE_LIST,
              list: res.data
            });
          } else {
            dispatch({
              type: types.LOADMORE_LIST,
              list: res.data
            });
          }
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
};

// set scroll height
export const setScrollHeight = height => ({
  type: types.SET_SCROLL_HEIGHT,
  height
});

// change page event
export const changePage = page => ({
  type: types.CHANGE_PAGE,
  page
});
