import React, { Fragment, Component } from 'react';
import ReactDOM from 'react-dom';
import { PullToRefresh, ListView, ActivityIndicator } from 'antd-mobile';
import Filters from 'comp/Filters';
import BackTop from 'comp/BackTop';
import HouseItem from './HouseItem';
import Header from 'comp/Header';
import { GetList } from '@/api';
import { getStorageByKey } from '@/util';

const NoMoreText = '没有更多了哦~';

class TabHouseList extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    // get searchQuery from sessionStorage
    const searchQuery = getStorageByKey('search_query');

    this.state = {
      dataSource: dataSource.cloneWithRows([]),
      refreshing: false,
      isLoading: false,
      height: null,
      hasMore: true,
      page: 1,
      size: 30,
      showBackTop: false,
      query: searchQuery
    };
  }

  componentDidMount() {
    // init ajax
    let { page, size, query } = this.state;
    this.handleGetList(page, size, query).then(list => {
      this.rData = list;
      if (list.length < size) {
        this.setState({
          hasMore: false
        });
      }
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
  async handleGetList(page, size = 30, query) {
    this.setState({ isLoading: true });
    let queryArr = [];
    let dataArr;
    for (let i in query) {
      queryArr.push({ key: i, value: query[i] });
    }
    try {
      dataArr = await GetList(page, size, queryArr);
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
      isLoading: true
    });
    let { page, size, query } = this.state;
    this.handleGetList(page, size, query).then(list => {
      if (list.length && list.length === size) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(list),
          hasMore: true
        });
      } else if (list.length && list.length < size) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(list),
          hasMore: false
        });
      } else {
        // no data
        this.setState({
          hasMore: false
        });
      }
      // common setState
      this.setState({
        isLoading: false,
        refreshing: false
      });
    });
  };

  // loadmore event
  onEndReached = () => {
    if (this.state.isLoading || !this.state.hasMore) {
      return;
    }
    this.setState(prev => ({ page: prev.page + 1, isLoading: true }));
    // ajax
    let { page, size, query } = this.state;
    this.handleGetList(page, size, query).then(list => {
      if (list.length && list.length === size) {
        this.rData = [...this.rData, ...list];
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.rData),
          isLoading: false
        });
      } else if (list.length && list.length < size) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.rData),
          hasMore: false
        });
      } else {
        // no more
        this.setState({
          hasMore: false,
          isLoading: false
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
    if (scrollTop > document.documentElement.clientHeight * 0.5) {
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

  // get list & set datasource
  setDataSource() {
    let { page, size, query } = this.state;
    let queryArr = [];
    for (let i in query) {
      queryArr.push({ key: i, value: query[i] });
    }
    GetList(page, size, queryArr).then(list => {
      this.rData = list;
      if (list.length < size) {
        this.setState({
          hasMore: false
        });
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(list)
      });
    });
  }

  // build new filter query
  buildNewQuery(key, exclude, delKey, value, customQuery, q) {
    let curQuery = Object.assign({}, this.state.query);
    let query;
    // if need exclude
    if (exclude) {
      const handleDelKey = k => {
        if (curQuery.hasOwnProperty(k)) {
          delete curQuery[k];
        }
      };
      // String `delkey`
      if (typeof delKey === 'string') {
        handleDelKey(delKey);
      } else if (Array.isArray(delKey)) {
        // Array `delkey`
        delKey.forEach(k => {
          handleDelKey(k);
        });
      }
    }
    // if need custom query
    if (customQuery) {
      query = q;
    } else {
      query = { [key]: value ? value : null };
    }
    // setState
    this.setState(
      {
        query: { ...curQuery, ...query }
      },
      () => this.setDataSource()
    );
  }

  // filter menus change event
  handleFilterChange = (type, v) => {
    // reset page to 1
    this.setState({ page: 1 });
    // set listview style `overflow:auto`
    this.handleFilterClose();
    // let query, newQuery;
    switch (type) {
      case 'area':
        // area or subway
        if (v[0] === 'area') {
          this.buildNewQuery('area', true, 'subway', v[1]);
        } else {
          // subway
          this.buildNewQuery('subway', true, 'area', v[1]);
        }
        break;
      case 'type':
        this.buildNewQuery('model', false, '', v[0]);
        break;
      case 'money':
        let oj = {};
        v[0].forEach(item => {
          oj[item.key] = item.value;
        });
        this.buildNewQuery('', true, ['price_gt', 'price_lt'], '', true, oj);
        break;
      case 'sort':
        this.buildNewQuery('sort', false, '', v[0]);
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
        <Header searchClick={this.props.searchClick} />
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
          renderFooter={() => {
            return this.state.hasMore ? (
              <div className="flexbox jc">
                <ActivityIndicator text="正在加载" />
              </div>
            ) : (
              <div className="flexbox jc">{NoMoreText}</div>
            );
          }}
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
          scrollRenderAheadDistance={1000}
          onEndReached={this.onEndReached}
          pageSize={10}
        />
        <BackTop show={this.state.showBackTop} toTop={this.handleBackTop} />
      </Fragment>
    );
  }
}
export default TabHouseList;
