import React, { Fragment, Component } from 'react';
import ReactDOM from 'react-dom';
import { Icon, PullToRefresh, ListView } from 'antd-mobile';
import Filters from 'comp/Filters';
import BackTop from 'comp/BackTop';
import HouseItem from './HouseItem';
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
      page: 1,
      showBackTop: false,
      query: null
    };
  }

  componentDidMount() {
    // init ajax
    let { page, query } = this.state;
    this.handleGetList(query, page).then(list => {
      this.rData = list;
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(list),
        isLoading: false
      });
    });

    // set list view height
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
  async handleGetList(query, page, size = 20) {
    this.setState({ isLoading: true });
    let dataArr;
    try {
      dataArr = await GetList(query, page, size);
    } catch (error) {
      console.error(error);
    }
    return dataArr || [];
  }

  // get list & set datasource
  setDataSource() {
    GetList(this.state.query, this.state.page).then(list => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(list)
      });
    });
  }

  // refresh event
  onRefresh = () => {
    this.setState({
      page: 1,
      refreshing: true,
      isLoading: true,
      footerText: 'Loading...'
    });
    this.handleGetList(this.state.query, this.state.page).then(list => {
      if (list.length) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(list),
          isLoading: false,
          refreshing: false,
          hasMore: true
        });
      } else {
        // no data
        this.setState({
          isLoading: false,
          refreshing: false,
          hasMore: false
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
    this.handleGetList(this.state.query, this.state.page).then(list => {
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

  // ListView scroll to top
  handleBackTop = () => {
    this.lv.scrollTo(0, 0);
  };

  // show `BackTop` component
  handleShowBackTop(e) {
    let scrollTop = e.target.scrollTop;
    if (scrollTop > this.state.height * 0.66) {
      this.setState({ showBackTop: true });
    } else {
      this.setState({ showBackTop: false });
    }
  }

  // when filter menus open, change `listview` style `overflow` to 'hidden'
  handleFilterOpen = () => {
    ReactDOM.findDOMNode(this.lv).style.overflow = 'hidden';
  };

  // filter menus close reset
  handleFilterClose = () => {
    ReactDOM.findDOMNode(this.lv).style.overflow = 'auto';
  };

  // build new filter query
  buildNewQuery(key) {
    let curQuery = this.state.query ? this.state.query.slice() : [];
    let newQuery = [];
    // if state.query exist key
    let hasKey;
    // judge typeof key
    let isArray = Array.isArray(key);
    let isString = typeof key === 'string';
    // if query.length
    if (curQuery.length) {
      // if is array
      if (isArray) {
        key.forEach(item => {
          curQuery.forEach(q => {
            if (q.key !== item) {
              newQuery.push(q);
            }
          });
        });
      } else if (isString) {
        curQuery.forEach(q => {
          if (q.key !== key) {
            newQuery.push(q);
          }
        });
      } else {
        throw new Error('unknow key type in function `buildNewQuery`');
      }
    }
    return newQuery;
  }

  // filter menus change event
  handleFilterChange = (type, v) => {
    // reset page to 1
    this.setState({ page: 1 });
    // set listview style `overflow:auto`
    this.handleFilterClose();
    let query, newQuery;
    switch (type) {
      case 'area':
        if (v[1]) {
          query = [{ key: 'area', value: v[1] }];
        } else {
          query = [{ key: 'area', value: '' }];
        }
        newQuery = this.buildNewQuery('area');
        this.setState(
          {
            query: this.state.query ? [...newQuery, ...query] : query
          },
          () => this.setDataSource()
        );
        break;
      case 'type':
        query = { key: 'model', value: v[0] };
        this.setState(
          { query: this.state.query ? [...this.state.query, query] : [query] },
          () => this.setDataSource()
        );
        break;
      case 'money':
        if (Array.isArray(v[0])) {
          query = v[0];
        } else {
          query = v;
        }
        newQuery = this.buildNewQuery(['price_gt', 'price_lt']);
        this.setState(
          {
            query: this.state.query ? [...newQuery, ...query] : query
          },
          () => this.setDataSource()
        );
        break;

      default:
        break;
    }
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
        <Filters
          open={this.handleFilterOpen}
          close={this.handleFilterClose}
          change={this.handleFilterChange}
        />
        <ListView
          style={{
            height: this.state.height
          }}
          ref={el => (this.lv = el)}
          dataSource={this.state.dataSource}
          renderFooter={() => (
            <div style={{ padding: 10, textAlign: 'center' }}>
              {this.state.footerText}
            </div>
          )}
          renderRow={row}
          pullToRefresh={
            <PullToRefresh
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          onScroll={e => {
            this.handleShowBackTop(e);
          }}
          scrollEventThrottle={500}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          pageSize={5}
        />
        <BackTop show={this.state.showBackTop} toTop={this.handleBackTop} />
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
