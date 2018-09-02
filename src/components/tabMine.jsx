import React, { Fragment } from 'react';
import { Button, List } from 'antd-mobile';

export default props => (
  <Fragment>
    <div className="user">
      <div className="user-avatar">
        <img src="" alt="" />
      </div>
      <div className="login">
        <Button inline>登录</Button>
      </div>
    </div>
    <div className="cate flexbox">
      <div className="cate-item flexbox house-source">
        <img src="" alt="" />
        <span>房源</span>
      </div>
      <div className="cate-item flexbox collect ">
        <img src="" alt="" />
        <span>收藏</span>
      </div>
    </div>
    <List className="about">
      <List.Item arrow="horizontal">关于</List.Item>
    </List>
    <style jsx>{`
      .cate {
        &-item {
          text-align: center;
          flex: 1;
          flex-direction: column;
        }
      }
    `}</style>
  </Fragment>
);
