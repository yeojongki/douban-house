import React, { Fragment } from 'react';
import { SearchBar, WhiteSpace } from 'antd-mobile';
import { resolveScopedStyles } from '@/util';

const scoped = resolveScopedStyles(
  <scope>
    <style jsx>{`
      .search {
        color: red;
      }
    `}</style>
  </scope>
);

class HSearchBar extends React.Component {
  state = {
    value: '美食'
  };
  render() {
    return (
      <Fragment>
        <SearchBar
          className={`search ${scoped.className}`}
          placeholder="Search"
          maxLength={8}
        />
        <WhiteSpace />
        {scoped.styles}
      </Fragment>
    );
  }
}

export default HSearchBar;
