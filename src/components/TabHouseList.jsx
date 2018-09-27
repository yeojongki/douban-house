import React, { Fragment, Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {
  fetchHouseList,
  setScrollHeight,
  changePage
} from '@/store/actions/houseList';
import { PullToRefresh, ListView, ActivityIndicator } from 'antd-mobile';
import Filters from 'comp/Filters';
import BackTop from 'comp/BackTop';
import HouseItem from './HouseItem';
import Header from 'comp/Header';
import { getStorageByKey } from '@/util';
const NoMoreText = '没有更多了哦~';

class TabHouseList extends Component {
  constructor(props) {
    super(props);

    // get searchQuery from sessionStorage
    const searchQuery = getStorageByKey('search_query');

    this.state = {
      showBackTop: false,
      query: searchQuery
    };
  }

  componentDidMount() {
    // init list
    this.handleGetList();
    // set list view height
    let top_h = this.filterRef.getBoundingClientRect().bottom;
    const bot_h = 50;
    this.props.setScrollHeight(
      document.documentElement.clientHeight - top_h - bot_h
    );
  }

  // handle get house list
  handleGetList(loadmore) {
    const { query } = this.state;
    const { fetchHouseList, page, size } = this.props;
    let queryArr = [];
    for (let i in query) {
      queryArr.push({ key: i, value: query[i] });
    }
    fetchHouseList(page, size, queryArr, loadmore);
  }

  // refresh event
  onRefresh = () => {
    const { changePage } = this.props;
    changePage(1);
    this.handleGetList();
  };

  // loadmore event
  onEndReached = () => {
    const { isLoading, hasMore, changePage, page } = this.props;
    if (isLoading || !hasMore) {
      return;
    }
    changePage(page + 1);
    this.handleGetList(true);
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
      () => this.handleGetList()
    );
  }

  // filter menus change event
  handleFilterChange = (type, v) => {
    const { changePage } = this.props;
    // reset page to 1
    changePage(1);
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
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    const { list, height, hasMore, refreshing } = this.props;
    const row = rowData => {
      return <HouseItem house={rowData} />;
    };
    return (
      <Fragment>
        <Header searchClick={this.props.searchClick} />
        <Filters
          filterRef={ref => (this.filterRef = ref)}
          open={this.handleFilterOpen}
          close={this.handleFilterClose}
          change={this.handleFilterChange}
        />
        <ListView
          style={{
            height: height
          }}
          ref={el => (this.lv = el)}
          dataSource={ds.cloneWithRows(list)}
          renderFooter={() => {
            return hasMore ? (
              <div className="flexbox jc">
                <ActivityIndicator text="正在加载" />
              </div>
            ) : (
              <div className="flexbox jc">{NoMoreText}</div>
            );
          }}
          renderRow={row}
          pullToRefresh={
            <PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} />
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

const mapState = state => {
  return {
    list: state.houseList.list,
    size: state.houseList.size,
    page: state.houseList.page,
    height: state.houseList.height,
    isLoading: state.houseList.loading.isLoading,
    hasMore: state.houseList.loading.hasMore,
    refreshing: state.houseList.loading.refreshing
  };
};

const mapDispatch = dispatch => ({
  fetchHouseList(page, size, filter, loadmore) {
    dispatch(fetchHouseList(page, size, filter, loadmore));
  },
  setScrollHeight(height) {
    dispatch(setScrollHeight(height));
  },
  changePage(page) {
    dispatch(changePage(page));
  }
});

export default connect(
  mapState,
  mapDispatch
)(TabHouseList);
