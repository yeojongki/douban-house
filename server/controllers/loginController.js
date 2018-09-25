const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../db');
const { successRet, errorRet } = require('../util');

// create token by jsonwebtoken
const createToken = (payload, secret = config.secret, t = config.expiresIn) =>
  jwt.sign(payload, secret, {
    expiresIn: t
  });

/**
 * login
 * @param {Object} user {username,password}
 */
module.exports = async ctx => {
  const user = ctx.request.body;
  const { username, password } = user;
  // no username or password
  if (!username) {
    ctx.body = errorRet(`请输入用户名`);
    return;
  }
  if (!password) {
    ctx.body = errorRet(`请输入密码`);
    return;
  }
  // check user if exist
  try {
    const userRet = await db.User.findOne({ username }, { _id: 0, __v: 0 });

    if (userRet) {
      // check password
      if (userRet.password === password) {
        await db.User.findOneAndUpdate(
          { username },
          { ltime: +new Date() + '' }
        );
        ctx.body = successRet({
          token: createToken({ username }),
          username: username
        });
      } else {
        // password no match
        ctx.body = errorRet(`密码不正确`);
      }
    } else {
      // register & login
      let t = +new Date() + '';
      await new db.User({ ...user, ctime: t, ltime: t }).save();
      ctx.body = successRet({
        token: createToken({ username }),
        username: username
      });
    }
  } catch (e) {
    ctx.body = errorRet(`login error: ${e.message || e}`);
  }
};
