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
 * @param {Object} user {name,password}
 */
module.exports = async ctx => {
  const user = ctx.request.body;
  const { name, password } = user;
  // no name or password
  if (!name) {
    ctx.body = errorRet(`请输入用户名`);
    return;
  }
  if (!password) {
    ctx.body = errorRet(`请输入密码`);
    return;
  }
  // check user if exist
  try {
    const userRet = await db.User.findOne({ name }, { _id: 0, __v: 0 });

    if (userRet) {
      // check password
      if (userRet.password === password) {
        ctx.body = successRet({ token: createToken({ name }), name: name });
      } else {
        // password no match
        ctx.body = errorRet(`密码不正确`);
      }
    } else {
      // register & login
      await new db.User(user).save();
      ctx.body = successRet({ token: createToken({ name }), name: name });
    }
  } catch (e) {
    ctx.body = errorRet(`login error: ${e.message || e}`);
  }
};
