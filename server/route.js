const Router = require('koa-router');
const db = require('./db');
const router = new Router({
  prefix: '/api'
});

const successCtx = (data, msg = 'success', code = 1) => ({
  code: code,
  data: data,
  msg: msg
});

const errorCtx = (msg = 'error', code = 0) => ({
  code: code,
  msg: msg
});

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
router.post('/list', async ctx => {
  let body = ctx.request.body,
    sort = { ctime: -1 },
    query = {};
  const { page = 1, size = 10 } = body;
  // if filter
  if (body.filter) {
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
      query.model
        ? (query.model = { $regex: query.model })
        : delete query.model;
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
  }
  // console.log(`search query`, query, sort);
  try {
    const houses = await db.Houses.find(query, { _id: 0, __v: 0 })
      .sort(sort)
      .limit(+size)
      .skip((page - 1) * size);
    ctx.body = successCtx(houses);
  } catch (e) {
    ctx.body = errorCtx(`search house error: ${e.message || e}`);
  }
});

/**
 * get house detail
 * @param {Number} tid topic id
 */
router.get('/house/:tid', async ctx => {
  const {
    params: { tid }
  } = ctx;

  try {
    const house = await db.Houses.findOne({ tid: tid }, { _id: 0, __v: 0 });
    ctx.body = successCtx(house);
  } catch (e) {
    ctx.body = errorCtx(`get house id[${tid}] error: ${e.message || e}`);
  }
});

module.exports = router;
