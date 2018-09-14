import React, { Fragment, Component } from 'react';
import { Icon, PullToRefresh, ListView } from 'antd-mobile';
import Filters from 'comp/filters';
import HouseItem from './houseItem';
import { GetList } from '@/api';

class TabHouseList extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    this.state = {
      dataSource: dataSource.cloneWithRows([]),
      refreshing: false,
      isLoading: false,
      height: null,
      hasMore: true,
      footerText: 'Loading...',
      page: 1
    };
  }

  componentDidMount() {
    // init ajax
    let { page } = this.state;
    this.handleGetList(page).then(list => {
      this.rData = list;
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(list),
        isLoading: false
      });
    });

    setTimeout(() => {
      const $ = el => document.querySelector(el);
      let top_h = $('.filter').getBoundingClientRect().bottom;
      let bot_h = $('.am-tabs-tab-bar-wrap').getBoundingClientRect().height;
      this.setState({
        height: document.documentElement.clientHeight - top_h - bot_h
      });
    }, 0);
  }

  // handle get house list
  async handleGetList(page, size = 20) {
    this.setState({ isLoading: true });
    let dataArr;
    try {
      dataArr = await GetList(page, size);
    } catch (error) {
      console.error(error);
    }
    return dataArr || [];
  }

  // refresh event
  onRefresh = () => {
    this.setState({
      page: 1,
      refreshing: true,
      isLoading: true,
      footerText: 'Loading...'
    });
    this.handleGetList(this.state.page).then(list => {
      if (list.length) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(list),
          isLoading: false,
          refreshing: false,
          hasMore: true
        });
      }
    });
  };

  // loadmore event
  onEndReached = () => {
    if (this.state.isLoading || !this.state.hasMore) {
      return;
    }
    this.setState(prev => ({ page: prev.page + 1, isLoading: true }));
    // ajax
    this.handleGetList(this.state.page).then(list => {
      if (list.length) {
        this.rData = [...this.rData, ...list];
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.rData),
          isLoading: false
        });
      } else {
        // no more
        this.setState({
          hasMore: false,
          isLoading: false,
          footerText: '没有更多了哦~'
        });
      }
    });
  };

  render() {
    const row = rowData => {
      return <HouseItem house={rowData} />;
    };
    return (
      <Fragment>
        <header className="flexbox">
          <div className="h__location flexbox ac jc">
            <Icon type="ellipsis" className="h__location__icon" />
            <span>广州</span>
          </div>
          <div
            className="h__search flexbox ac jc"
            onClick={this.props.navToSearch}
          >
            <Icon type="search" />
            <span>请输入地铁、户型、价格等</span>
          </div>
        </header>
        <Filters />
        <ListView
          dataSource={this.state.dataSource}
          renderFooter={() => (
            <div style={{ padding: 10, textAlign: 'center' }}>
              {this.state.footerText}
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
