const Router = require('koa-router');
const verifyMiddleware = require('./middlewares/verify');
const {
  houseListController,
  houseDetailController,
  loginController,
  collectController
} = require('./controllers');

const router = new Router({
  prefix: '/api'
});

// get house list
router.post('/list', houseListController);
// get house detail
router.get('/house/:tid', houseDetailController);
// handle login
router.post('/login', loginController);
// get user collection
router.post('/collect', verifyMiddleware, collectController);

module.exports = router;
