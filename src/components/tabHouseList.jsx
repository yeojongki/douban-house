import React, { Fragment } from 'react';
import { Icon } from 'antd-mobile';
import Header from 'comp/header';
// import SearchBar from 'comp/searchBar';

export default props => {
  // const navToSearch = ()=>{
  //   console.log(123)
  // }
  return (
    <Fragment>
      <Header>
        <div className="h__location flexbox ac jc">
          <Icon type="ellipsis" className="h__location__icon" />
          <span>广州</span>
        </div>
        <div className="h__search flexbox ac jc" onClick={props.navToSearch}>
          <Icon type="search" />
          <span>请输入地铁、户型、价格等</span>
          {/* <SearchBar /> */}
        </div>
      </Header>
      <style jsx>{`
        @import '../styles/variables.scss';
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
    </Fragment>
  );
};
