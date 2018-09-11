import React, { Fragment, Component } from 'react';
import { Icon, PullToRefresh, ListView } from 'antd-mobile';
import Filters from 'comp/filters';
// import HouseList from 'comp/houseList';
import HouseItem from './houseItem';

const list = [
  {
    price: '1008/月',
    title: '111111111111 ',
    img: '//www.baidu.com/img/baidu_jgylogo3.gif',
    tid: 1
  },
  {
    price: '',
    title: '2222222222222222222',
    img: '//www.baidu.com/img/baidu_jgylogo3.gif',
    tid: 222
  }
];

const NUM_ROWS = 40;
// let pageIndex = 0;

class TabHouseList extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    this.state = {
      dataSource,
      refreshing: false,
      isLoading: false,
      down: true,
      height: null,
      hasMore: true
    };
  }

  componentDidMount() {
    const $ = el => document.querySelector(el);
    setTimeout(() => {
      this.rData = this.genData();
      let top_h = $('.filter').getBoundingClientRect().bottom;
      let bot_h = $('.am-tabs-tab-bar-wrap').getBoundingClientRect().height;
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.genData()),
        height: document.documentElement.clientHeight - top_h - bot_h
      });
    }, 0);
  }

  genData(pIndex = 0) {
    console.log('get data', this.state.isLoading, !this.state.hasMore);
    const dataArr = [];
    for (let i = 0; i < NUM_ROWS; i++) {
      dataArr.push(`row - ${pIndex * NUM_ROWS + i}`);
    }
    console.log(dataArr);
    return dataArr;
  }

  onRefresh = () => {
    this.setState({ refreshing: true, isLoading: true });
    // simulate initial Ajax
    setTimeout(() => {
      this.rData = this.genData();
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false
      });
    }, 600);
  };

  onEndReached = event => {
    console.log('on end', this.state.isLoading, !this.state.hasMore);
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading || !this.state.hasMore) {
      return;
    }
    console.log('reach end', event);
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.setState({
        isLoading: false,
        hasMore: false
      });
    }, 1000);
  };

  render() {
    let index = list.length - 1;
    const row = () => {
      if (index < 0) {
        index = list.length - 1;
      }
      const obj = list[index--];
      return <HouseItem house={obj} />;
    };
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
        {/* <PullToRefresh
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
        </PullToRefresh> */}

        <ListView
          dataSource={this.state.dataSource}
          renderFooter={() => (
            <div style={{ padding: 10, textAlign: 'center' }}>
              {this.state.isLoading ? 'Loading...' : 'Loaded'}
            </div>
          )}
          renderRow={row}
          style={{
            height: this.state.height
          }}
          pullToRefresh={
            <PullToRefresh
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          pageSize={5}
        />
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
