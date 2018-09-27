import request from '@/util/request';

export const GetHouseById = id => {
  return new Promise((resolve, reject) => {
    request({
      url: `/house/${id}`
    })
      .then(res => {
        if (res && res.code === 1) {
          resolve(res.data);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const GetHouseList = (page = 1, size = 20, filter = []) => {
  return request({
    method: 'POST',
    data: { page, size, filter },
    url: '/list'
  });
};

export const AjaxLogin = user => {
  return request({
    method: 'POST',
    data: user,
    url: '/login'
  });
};
