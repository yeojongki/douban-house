import request from '@/util/request';
import * as types from '../actionTypes/common';

export const loading = loading => {
  return {
    type: types.LOADING,
    loading
  };
};