const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const router = require('./route');
const Robot = require('./robot');

app.use(bodyParser());
new Robot();

app.use(router.routes()).listen(3003, () => {
  console.log(`server start at http://localhost:3003`);
});
