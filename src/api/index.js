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

export const GetList = (page = 1, size = 20, filter) => {
  return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      data: { page, size, filter },
      url: '/list'
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

// export const GetList = (queryArr, page = 1, size = 20) => {
//   // console.log(queryArr);
//   let url
//   if(Array.isArray(queryArr)) {
//     url = `/search?page=${page}&size=${size}&`;
//     queryArr.forEach(q => {
//       url += `${q.key}=${q.value}&`;
//     });
//   } else {
//     url = `/search?page=${page}&size=${size}`
//   }
//   // console.log(url);
//   return new Promise((resolve, reject) => {
//     request({
//       url: url
//     })
//       .then(res => {
//         if (res && res.code === 1) {
//           resolve(res.data);
//         }
//       })
//       .catch(err => {
//         reject(err);
//       });
//   });
// };
