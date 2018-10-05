import React, { Fragment, Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {
  fetchHouseList,
  setScrollHeight,
  changePage,
  setScrollTop,
  setQuery
} from '@/store/actions/houseList';
import FilterMenu from 'comp/Filters';
import BackTop from 'comp/BackTop';
import { List as HouseList } from '../House';
import Header from 'comp/Header';

class TabHouseList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showBackTop: false
    };
  }

  componentDidMount() {
    // 初始化
    const { list, scrollTop, routeQuery, scrollHeight } = this.props;
    // 是否从搜索页返回
    const fromSearch = routeQuery && routeQuery.fromSearch;
    if (list && list.length && !fromSearch) {
      // 恢复滚动条位置
      if (scrollTop && this.lv) {
        this.lv.scrollTo(0, scrollTop);
      }
    } else {
      // redux中没有List才去请求
      this.handleGetList();
    }
    if (!scrollHeight) {
      // 搜索和下拉菜单的高度
      let top_h = this.filterRef.getBoundingClientRect().bottom;
      // 底部tabs高度
      const bot_h = 50;
      // 设置滚动高度
      this.props.dispatch(
        setScrollHeight(document.documentElement.clientHeight - top_h - bot_h)
      );
    }
  }

  //组件卸载时存储滚动条位置
  componentWillUnmount() {
    this.saveScroll();
  }

  // 存储滚动条位置
  saveScroll() {
    if (this.lv) {
      let scrollTop = this.lv.listviewRef.ListViewRef.ScrollViewRef.scrollTop;
      this.props.dispatch(setScrollTop(scrollTop));
    }
  }

  // 获取房源列表
  handleGetList(isLoadmore) {
    const { dispatch, page, size, query } = this.props;
    let queryArr = [];
    for (let i in query) {
      queryArr.push({ key: i, value: query[i] });
    }
    dispatch(fetchHouseList(page, size, queryArr, isLoadmore));
  }

  // 下拉刷新事件
  onRefresh = () => {
    this.props.dispatch(changePage(1));
    this.handleGetList();
  };

  // 上拉加载更多事件
  onEndReached = () => {
    const { isLoading, hasMore, dispatch, page } = this.props;
    if (isLoading || !hasMore) {
      return;
    }
    dispatch(changePage(page + 1));
    this.handleGetList(true);
  };

  // 列表滚动到顶部
  handleBackTop = () => {
    this.lv && this.lv.scrollTo(0, 0);
  };

  // 是否显示回顶部按钮
  handleShowBackTop = e => {
    let scrollTop = e.target.scrollTop;
    if (scrollTop > document.documentElement.clientHeight * 0.5) {
      this.setState({ showBackTop: true });
    } else {
      this.setState({ showBackTop: false });
    }
  };

  // 打开菜单设置列表不能滚动
  handleFilterOpen = () => {
    if (this.lv) {
      ReactDOM.findDOMNode(this.lv).style.overflow = 'hidden';
    }
  };

  // 关闭菜单设置列表恢复滚动
  handleFilterClose = () => {
    if (this.lv) {
      ReactDOM.findDOMNode(this.lv).style.overflow = 'auto';
    }
  };

  // 构建新的搜索参数
  buildNewQuery(key, exclude, delKey, value, customQuery, q) {
    const { dispatch, query } = this.props;
    let curQuery = Object.assign({}, query);
    let newQuery;
    // 如果需要排除
    if (exclude) {
      const handleDelKey = k => {
        if (curQuery.hasOwnProperty(k)) {
          delete curQuery[k];
        }
      };
      // 如果`delkey`是string类型
      if (typeof delKey === 'string') {
        handleDelKey(delKey);
      } else if (Array.isArray(delKey)) {
        // Array类型
        delKey.forEach(k => {
          handleDelKey(k);
        });
      }
    }
    // 如果需要自定义参数
    if (customQuery) {
      newQuery = q;
    } else {
      newQuery = { [key]: value ? value : null };
    }
    // set redux
    dispatch(setQuery({ ...curQuery, ...newQuery }));
    this.handleGetList();
  }

  // 下拉菜单选择后的事件
  handleFilterChange = (type, v) => {
    // 重置到第一页
    this.props.dispatch(changePage(1));
    // 回到顶部
    this.handleBackTop();
    // 设置可以滚动
    this.handleFilterClose();
    switch (type) {
      // 区域
      case 'area':
        if (v[0] === 'area') {
          this.buildNewQuery('area', true, 'subway', v[1]);
        } else {
          this.buildNewQuery('subway', true, 'area', v[1]);
        }
        break;
      // 出租类型
      case 'type':
        this.buildNewQuery('model', false, '', v[0]);
        break;
      // 租金
      case 'money':
        let arr;
        if (v[0]) {
          arr = v[0].split(',');
        } else {
          // 选择菜单为第一个`不限`时
          this.buildNewQuery('price_gt', true, ['price_gt', 'price_lt'], v[0]);
        }
        if (arr) {
          // 说明值是区间 如[0,2000] => '{price_lt:1000,price_gt:2000}'
          if (arr.length === 2) {
            let oj = {};
            oj.price_gt = arr[0];
            oj.price_lt = arr[1];
            this.buildNewQuery(
              '',
              true,
              ['price_gt', 'price_lt'],
              '',
              true,
              oj
            );
          } else {
            // 说明是大于值 如[5000] => '{price_gt:5000}'
            this.buildNewQuery('price_gt', false, '', v[0]);
          }
        }
        break;
      // 排序
      case 'sort':
        this.buildNewQuery('sort', false, '', v[0]);
        break;

      default:
        break;
    }
  };

  render() {
    const {
      list,
      scrollHeight,
      hasMore,
      refreshing,
      scrollTop,
      query
    } = this.props;
    return (
      <Fragment>
        <Header
          searchClick={this.props.searchClick}
          placeholder={query.title}
        />
        <FilterMenu
          filterRef={ref => (this.filterRef = ref)}
          open={this.handleFilterOpen}
          close={this.handleFilterClose}
          change={this.handleFilterChange}
        />
        <HouseList
          height={scrollHeight}
          lv={ref => (this.lv = ref)}
          list={list}
          hasMore={hasMore}
          refreshing={refreshing}
          scrollTop={scrollTop}
          onScroll={this.handleShowBackTop}
          onEndReached={this.onEndReached}
          onRefresh={this.onRefresh}
        />
        <BackTop show={this.state.showBackTop} toTop={this.handleBackTop} />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  list: state.houseList.list,
  size: state.houseList.size,
  page: state.houseList.page,
  query: state.houseList.query,
  scrollHeight: state.houseList.scrollHeight,
  scrollTop: state.houseList.scrollTop,
  isLoading: state.houseList.loading.isLoading,
  hasMore: state.houseList.loading.hasMore,
  refreshing: state.houseList.loading.refreshing,
  routeQuery: state.router.location.query
});

export default connect(mapStateToProps)(TabHouseList);
