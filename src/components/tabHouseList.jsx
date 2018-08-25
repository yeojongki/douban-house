import React, { Fragment } from 'react';
import { Icon } from 'antd-mobile';
import Header from 'comp/header';
import SearchBar from 'comp/searchBar';
import { resolveScopedStyles } from '@/util';

const scoped = resolveScopedStyles(
  <scope>
    <style jsx>{'.test { color: red }'}</style>
  </scope>
);
export default props => (
  <Fragment>
    <Header>
      <div className="h__location">
        <Icon type="ellipsis" className={`test ${scoped.className}`} />
        <span>广州</span>
      </div>
      <div className="h__search">
        <SearchBar />
      </div>
    </Header>
    {scoped.styles}
    <style jsx>{`
      .h {
        &__location {
          float: left;
        }
        &h__search {
          float: left;
        }
      }
    `}</style>
  </Fragment>
);
