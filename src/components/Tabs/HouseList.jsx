import React, { Fragment, Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {
  fetchHouseList,
  setScrollHeight,
  changePage
} from '@/store/actions/houseList';
import FilterMenu from 'comp/Filters';
import BackTop from 'comp/BackTop';
import { List as HouseList } from '../House';
import Header from 'comp/Header';
import { getStorageByKey } from '@/util';

class TabHouseList extends Component {
  constructor(props) {
    super(props);

    // 从sessionStorage获取搜索历史
    const searchQuery = getStorageByKey('search_query');

    this.state = {
      showBackTop: false,
      query: searchQuery
    };
  }

  componentDidMount() {
    // 初始化
    this.handleGetList();
    // 搜索和下拉菜单的高度
    let top_h = this.filterRef.getBoundingClientRect().bottom;
    // 底部tabs高度
    const bot_h = 50;
    // 设置滚动高度
    this.props.dispatch(
      setScrollHeight(document.documentElement.clientHeight - top_h - bot_h)
    );
  }

  // 获取房源列表
  handleGetList(loadmore) {
    const { query } = this.state;
    const { dispatch, page, size } = this.props;
    let queryArr = [];
    for (let i in query) {
      queryArr.push({ key: i, value: query[i] });
    }
    dispatch(fetchHouseList(page, size, queryArr, loadmore));
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
    this.lv.scrollTo(0, 0);
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
    let curQuery = Object.assign({}, this.state.query);
    let query;
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

  // 下拉菜单选择后的事件
  handleFilterChange = (type, v) => {
    // 重置到第一页
    this.props.dispatch(changePage(1));
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
        let oj = {};
        v[0].forEach(item => {
          oj[item.key] = item.value;
        });
        this.buildNewQuery('', true, ['price_gt', 'price_lt'], '', true, oj);
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
    const { list, height, hasMore, refreshing } = this.props;
    return (
      <Fragment>
        <Header searchClick={this.props.searchClick} />
        <FilterMenu
          filterRef={ref => (this.filterRef = ref)}
          open={this.handleFilterOpen}
          close={this.handleFilterClose}
          change={this.handleFilterChange}
        />
        <HouseList
          height={height}
          lv={ref => (this.lv = ref)}
          list={list}
          hasMore={hasMore}
          refreshing={refreshing}
          handleShowBackTop={this.handleShowBackTop}
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
  height: state.houseList.height,
  isLoading: state.houseList.loading.isLoading,
  hasMore: state.houseList.loading.hasMore,
  refreshing: state.houseList.loading.refreshing
});

export default connect(mapStateToProps)(TabHouseList);
