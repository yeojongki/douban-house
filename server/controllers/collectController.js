const { successRet, errorRet } = require('../util');

/**
 * get user collections
 */
module.exports = async ctx => {
  ctx.body = successRet({ user: ctx.username });
};
