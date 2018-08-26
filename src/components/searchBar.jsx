import React, { Fragment, Component } from 'react';
import { withRouter } from 'react-router-dom';
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

class MySearchBar extends Component {
  componentDidMount() {
    this.autoFocusInst.focus();
  }
  render() {
    return (
      <Fragment>
        <SearchBar
          className={`search ${scoped.className}`}
          placeholder="Search"
          maxLength={20}
          ref={ref => (this.autoFocusInst = ref)}
          onCancel={this.props.history.goBack}
          onChange={val => this.props.typing(val)}
        />
        <WhiteSpace />
        {scoped.styles}
      </Fragment>
    );
  }
}

export default withRouter(MySearchBar);
