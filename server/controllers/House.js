const db = require('../db');
const { successRet, errorRet, verifyToken } = require('../util');

/**
 * get house detail
 * @param {Number} tid topic id
 */
const GetDetail = async ctx => {
  const {
    params: { tid }
  } = ctx;
  const token = ctx.header['x-token'];
  // if user is login
  let isLike;
  if (token) {
    try {
      let decode = verifyToken(token);
      let { username } = decode;
      const user = await db.User.findOne({ username }, { _id: 0, __v: 0 });
      if (user) {
        if (user.likes.includes(tid)) {
          isLike = true;
        }
      }
    } catch (e) {
      ctx.body = errorRet(`house detail getUser error: ${e.message || e}`);
    }
  }

  // find house
  try {
    const house = await db.House.findOne({ tid }, { _id: 0, __v: 0 });
    ctx.body = successRet({ house, isLike });
  } catch (e) {
    ctx.body = errorRet(`get house id[${tid}] error: ${e.message || e}`);
  }
};

/**
 * @description get/search house list
 * @param {Number} page page number
 * @param {Number} size the size length of every page
 * @param {Object} filter search query
 * @param {Boolean} imgs have imgs ?
 * @param {Boolean} contact have contact way ?
 * @param {String} area area like '天河','越秀'
 * @param {Number/String} subway subway line like 'APM',1,'广佛'
 * @param {String} model house model like '一房一厅','4房2卫'
 * @param {Number} size_gt gt house size
 * @param {Number} size_lt lt house size
 * @param {Number} price_gt gt house price
 * @param {Number} price_lt lt house price
 */
const GetList = async ctx => {
  let body = ctx.request.body,
    sort = { ctime: -1 },
    query = {};
  const { page = 1, size = 10 } = body;

  // if filter
  if (body.filter && body.filter.length) {
    Object.values(body.filter).forEach(item => {
      query[item.key] = item.value;
    });
    // if object has own key
    const h = (key, o = query) => o.hasOwnProperty(key);
    // other keys need formatted
    if (h('price_gt') && !h('price_lt')) {
      query.price = { $gt: +query.price_gt };
      delete query.price_gt;
    }
    if (h('price_lt') && !h('price_gt')) {
      query.price = { $lt: +query.price_lt };
      delete query.price_lt;
    }
    if (h('price_gt') && h('price_lt')) {
      query.price = { $lt: +query.price_lt, $gt: +query.price_gt };
      delete query.price_gt;
      delete query.price_lt;
    }
    if (h('size_gt') && !h('size_lt')) {
      query.size = { $gt: +query.size_gt };
      delete query.size_gt;
    }
    if (h('size_lt') && !h('size_gt')) {
      query.size = { $lt: +query.size_lt };
      delete query.size_lt;
    }
    if (h('size_gt') && h('size_lt')) {
      query.size = { $lt: +query.size_lt, $gt: +query.size_gt };
      delete query.size_gt;
      delete query.size_lt;
    }
    if (h('model')) {
      if (query.model) {
        query.model = { $regex: query.model };
      } else {
        delete query.model;
      }
    }
    // sort
    if (h('sort')) {
      if (query.sort) {
        let key = query.sort;
        if (key === 'imgs') {
          query['imgs.0'] = { $exists: 1 };
        } else if (key === 'ctime') {
          sort = { ctime: -1 };
        } else if (key === 'contact') {
          query.contact = { $ne: null };
        } else if (key === 'price_desc') {
          sort = { price: 1 };
          query.price = { $ne: null };
        } else if (key === 'price_asc') {
          sort = { price: -1 };
          query.price = { $ne: null };
        }
      }
      delete query.sort;
    }
    // title
    if (h('title')) {
      query.title = { $regex: query.title };
    }
  }

  try {
    const houses = await db.House.find(query, { _id: 0, __v: 0 })
      .sort(sort)
      .limit(+size)
      .skip((page - 1) * size);
    ctx.body = successRet(houses);
  } catch (e) {
    ctx.body = errorRet(`search house error: ${e.message || e}`);
  }
};

module.exports = {
  GetList,
  GetDetail
};
