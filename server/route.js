const Router = require('koa-router');
const verifyMiddleware = require('./middlewares/verify');
const { User, House } = require('./controllers');

const router = new Router({
  prefix: '/api'
});

// get house list
router.post('/list', House.GetList);
// get house detail
router.get('/house/:tid', House.GetDetail);
// handle login
router.post('/login', User.Login);
// handle user like
router.post('/like', verifyMiddleware, User.Like);
// get user like list
router.post('/likes', verifyMiddleware, User.LikeList);

module.exports = router;
