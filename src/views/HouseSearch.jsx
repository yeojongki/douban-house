import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SearchBar } from 'antd-mobile';
import SvgIcon from 'comp/SvgIcon';
import { setStorageByKey, getStorageByKey } from '@/util';
import { setQuery } from '@/store/actions/houseList';

// localstorage search key
const historyKey = 'search_history';

class SearchPage extends Component {
  constructor() {
    super();

    // 从localstorage获取搜索历史
    const history = getStorageByKey(historyKey, 'local');

    this.state = {
      searchHistory: history || []
    };
  }

  componentDidMount() {
    this.autoFocusInst.focus();
  }

  // 搜索提交
  handleSubmit = val => {
    if (val) {
      // 从localStorge获取历史搜索记录
      let searchHistory = getStorageByKey(historyKey, 'local');
      // 如果有历史记录
      if (searchHistory) {
        // 最多设置7个，大于就移除最开始的
        if (searchHistory.length > 7) {
          searchHistory.pop();
        }
        // 如果历史记录不存在当前搜索内容,则添加
        if (!searchHistory.includes(val)) {
          searchHistory.unshift(val);
        }
      } else {
        searchHistory = [val];
      }

      // 搜索历史添加到localStorage
      setStorageByKey(historyKey, searchHistory, 'local');
      // 搜索参数添加到redux {"title":"天河"}
      const { dispatch } = this.props;
      // 从redux中获取原来的query
      const query = this.props.query;
      dispatch(setQuery({ ...query, title: val }));
      // 返回首页
      this.props.history.replace({
        pathname: '/',
        query: { fromSearch: true }
      });
    } else {
      this.handleCancel();
    }
  };

  // 点击取消
  handleCancel = () => {
    this.props.history.replace('/');
  };

  // 删除历史记录
  removeHistory = () => {
    window.localStorage.removeItem(historyKey);
    this.setState({
      searchHistory: []
    });
    this.autoFocusInst.focus();
  };

  // 点击历史记录的项
  historyClick(value) {
    this.handleSubmit(value);
  }

  render() {
    const { searchHistory } = this.state;
    const { query } = this.props;
    return (
      <div className="search">
        <SearchBar
          placeholder="请输入关键词"
          defaultValue={query && query.title ? query.title : ''}
          showCancelButton={true}
          maxLength={20}
          ref={ref => (this.autoFocusInst = ref)}
          onSubmit={val => this.handleSubmit(val)}
          onCancel={this.handleCancel}
          onClear={this.handleClear}
        />
        {searchHistory.length ? (
          <div className="search-history">
            <div className="search-history-title">
              <p>搜索历史</p>
            </div>
            <div className="search-history-item">
              {searchHistory.map((item, index) => (
                <div
                  className="item flexbox ac"
                  key={index}
                  onClick={() => this.historyClick(item)}
                >
                  <SvgIcon name="time" color="#666" />
                  <span className="">{item}</span>
                  <div className="border1px" />
                </div>
              ))}
            </div>
            <div className="search-history-remove" onClick={this.removeHistory}>
              <p>清除历史记录</p>
            </div>
          </div>
        ) : null}

        <style jsx>{`
          @import '../styles/mixins.scss';
          .search {
            &-history {
              padding: 0 20px;
              p {
                margin: 0;
              }
              &-title {
                color: #999;
                margin: 20px 0;
              }
              &-item {
                .item {
                  position: relative;
                  padding: 20px 0;
                  span {
                    color: #666;
                    margin-left: 10px;
                    @include ellipsis();
                  }
                  .border1px {
                    top: auto;
                    bottom: 0;
                  }
                }
              }
              &-remove {
                margin-top: 30px;
                color: #999;
                text-align: center;
              }
            }
          }
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = state => ({ query: state.houseList.query });
export default connect(mapStateToProps)(SearchPage);
