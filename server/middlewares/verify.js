const { errorRet, verifyToken } = require('../util');

module.exports = async (ctx, next) => {
  // get header token
  const token = ctx.header['x-token'];
  if (token) {
    try {
      let decode = verifyToken(token);
      ctx.username = decode.username;
      await next();
    } catch (error) {
      ctx.body = errorRet(`${error.message}`);
    }
  } else {
    ctx.body = errorRet(`Token is required`);
  }
};
