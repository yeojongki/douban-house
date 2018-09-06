import React, { Fragment, Component } from 'react';
import { Icon, PullToRefresh } from 'antd-mobile';
import Filters from 'comp/filters';
import HouseList from 'comp/houseList';

class TabHouseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      down: true,
      height: null
    };
  }
  componentDidMount() {
    const $ = el => document.querySelector(el);
    setTimeout(() => {
      let top_h = $('.filter').getBoundingClientRect().bottom;
      let bot_h = $('.am-tabs-tab-bar-wrap').getBoundingClientRect().height;
      this.setState({
        height: document.documentElement.clientHeight - top_h - bot_h
      });
    }, 0);
  }
  render() {
    const list = [
      {
        price: '1008/月',
        title:
          '123123123123从撒打算的12123123123123从撒打算的123123123123从撒打算的123123123123从撒打算的3123123123从撒打算的123123123123从撒打算的',
        img: '//www.baidu.com/img/baidu_jgylogo3.gif',
        tid: 1
      },
      {
        price: '',
        title: '23从撒打算的',
        img: '//www.baidu.com/img/baidu_jgylogo3.gif',
        tid: 222
      }
    ];
    const props = this.props;
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
        <Filters />
        <PullToRefresh
          damping={60}
          ref={el => (this.ptr = el)}
          style={{
            height: this.state.height,
            overflow: 'auto'
          }}
          indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
          direction={this.state.down ? 'down' : 'up'}
          refreshing={this.state.refreshing}
          onRefresh={() => {
            this.setState({ refreshing: true });
            setTimeout(() => {
              this.setState({ refreshing: false });
            }, 1000);
          }}
        >
          <HouseList list={list} />
        </PullToRefresh>
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
      </Fragment>
    );
  }
}
export default TabHouseList;
