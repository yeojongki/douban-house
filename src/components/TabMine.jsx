import React, { Fragment } from 'react';
import { Button, List } from 'antd-mobile';
import SvgIcon from 'comp/SvgIcon';
import ImgProxy from 'comp/ImgProxy';
import { resolveScopedStyles } from '@/util';

const scoped = resolveScopedStyles(
  <scope>
    <style jsx>{`
      .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        display: inline-block;
        vertical-align: middle;
      }
      .login-btn {
        width: 250px;
        height: 70px;
        line-height: 70px;
        margin-left: 60px;
        display: inline-block;
        vertical-align: middle;
      }
    `}</style>
  </scope>
);
export default props => {
  let login = false;
  return (
    <Fragment>
      <div className="mine">
        <div className="user">
          <ImgProxy className={`avatar ${scoped.className}`} />
          {login ? null : (
            <Button
              type="ghost"
              className={`login-btn ${scoped.className}`}
              onClick={() => props.navTo('route', '/login')}
            >
              登录
            </Button>
          )}
        </div>
        <div className="cate flexbox">
          <div
            className="cate-item flexbox ac house-source"
            onClick={() => props.navTo('route', '/')}
          >
            <SvgIcon name="homepage" width="28" height="28" />
            <span>房源</span>
          </div>
          <div
            className="cate-item flexbox ac"
            onClick={() => props.navTo('route', '/likes')}
          >
            <SvgIcon name="like" width="28" height="28" />
            <span>喜欢</span>
          </div>
        </div>
        <List className="about">
          <List.Item
            arrow="horizontal"
            onClick={() => props.navTo('route', '/about')}
          >
            关于
          </List.Item>
          <List.Item
            arrow="horizontal"
            onClick={() =>
              props.navTo(
                'outside',
                'https://github.com/yeojongki/douban-house'
              )
            }
          >
            源码
          </List.Item>
          <List.Item
            arrow="horizontal"
            onClick={() =>
              props.navTo(
                'outside',
                'http://ssr.yeojongki.cn/article/5b7687e8b7afb75b61ec0a0e'
              )
            }
          >
            博客
          </List.Item>
        </List>
      </div>
      <style jsx>{`
        @import '../styles/index.scss';
        .mine {
          min-height: 100%;
          background: #fff;
          .user {
            padding: 20px 40px;
          }
          .cate {
            border-bottom: 20px solid $gray-bg;
            padding: 20px 0;
            &-item {
              text-align: center;
              flex: 1;
              flex-direction: column;
            }
          }
        }
      `}</style>
      {scoped.styles}
    </Fragment>
  );
};
