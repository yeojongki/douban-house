const db = require('../db');
const { successRet, errorRet } = require('../util');

/**
 * get house detail
 * @param {Number} tid topic id
 */
module.exports = async ctx => {
  const {
    params: { tid }
  } = ctx;

  try {
    const house = await db.House.findOne({ tid: tid }, { _id: 0, __v: 0 });
    ctx.body = successRet(house);
  } catch (e) {
    ctx.body = errorRet(`get house id[${tid}] error: ${e.message || e}`);
  }
};
