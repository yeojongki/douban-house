import request from "@/util/request";

export const GetList = (page, size) => {
  return new Promise((resolve, reject) => {
    request({
      url: `/list?page=${page}&size=${size}`
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
