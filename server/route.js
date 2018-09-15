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
 * get house list
 * @param {Number} page nth of page
 * @param {Number} size size of one page
 */
router.get('/list', async ctx => {
  const {
    query: { page = 1, size = 10 }
  } = ctx;

  try {
    const list = await db.Houses.find(null, { _id: 0, __v: 0 })
      .sort({ ltime: -1 })
      .limit(+size)
      .skip((page - 1) * size);
    ctx.body = successCtx(list);
  } catch (e) {
    ctx.body = errorCtx(`get house list error: ${e.message || e}`);
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

/**
 * search house
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
router.get('/search', async ctx => {
  let { query } = ctx;
  const {
    query: {
      page = 1,
      size = 10,
      imgs,
      contact,
      size_gt,
      size_lt,
      price_gt,
      price_lt,
      model
    }
  } = ctx;
  delete query.page;
  delete query.size;
  if (imgs) {
    delete query.imgs;
    query['imgs.0'] = { $exists: 1 };
  }
  if (contact) {
    query.contact = { $ne: null };
  }
  if (price_gt && !price_lt) {
    delete query.price_gt;
    query.price = { $gt: +price_gt };
  }
  if (price_lt && !price_gt) {
    delete query.price_lt;
    query.price = { $lt: +price_lt };
  }
  if (price_gt && price_lt) {
    delete query.price_gt;
    delete query.price_lt;
    query.price = { $lt: +price_lt, $gt: +price_gt };
  }
  if (size_gt && !size_lt) {
    delete query.size_gt;
    query.size = { $gt: +size_gt };
  }
  if (size_lt && !size_gt) {
    delete query.size_lt;
    query.size = { $lt: +size_lt };
  }
  if (size_gt && size_lt) {
    delete query.size_gt;
    delete query.size_lt;
    query.size = { $lt: +size_lt, $gt: +size_gt };
  }
  if (model) {
    query.model = { $regex: model };
  }
  // console.log('search query', query);
  try {
    const houses = await db.Houses.find(query, { _id: 0, __v: 0 })
      .limit(+size)
      .skip((page - 1) * size);
    ctx.body = successCtx(houses);
  } catch (e) {
    ctx.body = errorCtx(`search house error: ${e.message || e}`);
  }
});

module.exports = router;
