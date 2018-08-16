const Router = require('koa-router');
const db = require('./db');
const router = new Router({
  prefix: '/api'
});

// get house list
router.get('/list', async ctx => {
  const {
    query: { page = 1, size = 10 }
  } = ctx;

  let list = await db.Houses.find(null, { _id: 0, __v: 0 })
    .limit(+size)
    .skip((page - 1) * size);
    
  ctx.body = list;
});

module.exports = router;
