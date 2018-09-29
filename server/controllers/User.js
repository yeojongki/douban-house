const db = require('../db');
const { successRet, errorRet, createToken } = require('../util');

/**
 * user login
 * @param {Object} user {username,password}
 */
const Login = async ctx => {
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

/**
 * 用户点击喜欢房子
 * @param {String} tid 贴子id
 * @param {Boolean} unlike 是否为不喜欢
 */
const Like = async ctx => {
  const { username } = ctx;
  const { tid, unlike } = ctx.request.body;
  try {
    const user = await db.User.findOne({ username });
    if (user) {
      let originLikes = user.likes;
      // 是否在喜欢列表里面
      const tidIndex = originLikes.findIndex(v => v === tid);
      const isInclude = tidIndex > -1;
      // 取消喜欢
      if (unlike) {
        if (!isInclude) {
          ctx.body = errorRet(`非法操作`);
        } else {
          // update like list
          originLikes.splice(tidIndex, 1);
          await db.User.findOneAndUpdate({ username }, { likes: originLikes });
          ctx.body = successRet(null, '已取消');
        }
      } else {
        // 喜欢
        if (isInclude) {
          ctx.body = errorRet(`不能喜欢多次`);
        } else {
          // update like list
          originLikes.push(tid);
          if (~~originLikes.length) {
            await db.User.findOneAndUpdate(
              { username },
              { likes: originLikes }
            );
            ctx.body = successRet(null, '已喜欢');
          }
        }
      }
    }
  } catch (e) {
    ctx.body = errorRet(`user like error: ${e.message || e}`);
  }
};

/**
 * 用户喜欢房源列表
 */
const LikeList = async ctx => {
  const { username } = ctx;
  try {
    const user = await db.User.findOne({ username });
    if (user) {
      let houses = await db.House.find({ tid: { $in: user.likes } });
      ctx.body = successRet(houses);
    }
  } catch (e) {
    ctx.body = errorRet(`user like error: ${e.message || e}`);
  }
};

module.exports = {
  Login,
  Like,
  LikeList
};
