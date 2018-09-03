import React, { Fragment, Component } from 'react';
import { Icon } from 'antd-mobile';
import Filters from 'comp/filters';

class TabHouseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fixed: false
    };
  }
  fixHeader = () => {
    this.setState({
      fixed: !this.state.fixed
    });
  };
  render() {
    const props = this.props,
      { fixed } = this.state;
    console.log(fixed);
    return (
      <Fragment>
        <header className="flexbox">
          <div className="h__location flexbox ac jc">
            <Icon type="ellipsis" className="h__location__icon" />
            <span>广州</span>
          </div>
          <div className="h__search flexbox ac jc" onClick={props.navToSearch}>
            <Icon type="search" />
            <span>请输入地铁、户型、价格等</span>
          </div>
        </header>
        <Filters fixHeader={this.fixHeader} />
        <style jsx>{`
          @import '../styles/variables.scss';
          header {
            padding: 20px 0;
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
      </Fragment>
    );
  }
}
export default TabHouseList;
