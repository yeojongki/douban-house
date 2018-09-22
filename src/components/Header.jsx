import React from 'react';
import { Icon } from 'antd-mobile';
import SvgIcon from 'comp/SvgIcon';

export default props => (
  <header className="flexbox">
    <div className="h__location flexbox ac jc">
      <SvgIcon name="coordinates" />
      <span>广州</span>
    </div>
    <div className="h__search flexbox ac jc" onClick={props.searchClick}>
      <Icon type="search" />
      <span>请输入地铁、户型、价格等</span>
    </div>
    <style jsx>{`
      @import '../styles/variables.scss';
      header {
        height: 75px;
        padding-top: 15px;
        background: #fff;
      }
      .h {
        &__location {
          flex: 1;
        }
        &__search {
          flex: 5;
          color: $placeholder;
          background: $gray-bg;
          padding: 10px;
          margin-right: 15px;
          border-radius: 10px;
        }
      }
    `}</style>
  </header>
);
