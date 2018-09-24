const jwt = require('jsonwebtoken');
const config = require('../config');
const { errorRet } = require('../util');

// verify token by jsonwebtoken
const verifyToken = token => jwt.verify(token, config.secret);

module.exports = async (ctx, next) => {
  // get header token
  const token = ctx.header.authorization;
  if (token) {
    let decode;
    try {
      decode = verifyToken(token);
      ctx.username = decode.name;
      await next();
    } catch (error) {
      ctx.body = errorRet(`${error.message}`);
    }
  } else {
    ctx.body = errorRet(`Token is required`);
  }
};
