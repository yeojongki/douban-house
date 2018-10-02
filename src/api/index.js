import request from '@/util/request';

/**
 * @desc根据房源tid获取详细信息
 * @param {Number/String} tid
 */
export const GetHouseById = tid => {
  return request({
    url: `/house/${tid}`
  });
};

/**
 * @desc 获取房源列表（带搜索）
 * @param {Number} page 第几页
 * @param {Number} size 每页几条
 * @param {Array} filter 搜索参数
 */
export const GetHouseList = (page = 1, size = 30, filter = []) => {
  return request({
    method: 'POST',
    data: { page, size, filter },
    url: '/list'
  });
};

/**
 * @desc 登录
 * @param {Object} user {usename:'',password:''}
 */
export const AjaxLogin = user => {
  return request({
    method: 'POST',
    data: user,
    url: '/login'
  });
};

/**
 * 用户点击喜欢/取消喜欢
 * @param {String/Number} tid
 * @param {Boolean} unlike 是否为不喜欢
 */
export const UserLikeHouse = (tid, unlike) => {
  return request({
    method: 'POST',
    data: { tid, unlike },
    url: '/like'
  });
};

/**
 * 用户喜欢列表
 */
export const GetUserLikeList = () => {
  return request({
    method: 'POST',
    url: '/likes'
  });
};
