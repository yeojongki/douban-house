import React, { Fragment, Component } from 'react';
import { SearchBar, WhiteSpace } from 'antd-mobile';
import { withRouter } from 'react-router-dom';

class MySearchBar extends Component {
  componentDidMount() {
    this.autoFocusInst.focus();
  }
  render() {
    return (
      <Fragment>
        <SearchBar
          placeholder="请输入地铁、户型、价格等"
          maxLength={20}
          ref={ref => (this.autoFocusInst = ref)}
          onCancel={this.props.onCancel}
          onBlur={this.props.onBlur}
          onChange={val => this.props.typing(val)}
        />
        <WhiteSpace />
      </Fragment>
    );
  }
}

export default withRouter(MySearchBar);
