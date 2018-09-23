import React, { Component } from 'react';
import { SearchBar } from 'antd-mobile';
import SvgIcon from 'comp/SvgIcon';
import { setStorageByKey, getStorageByKey } from '@/util';

// localstorage search key
const historyKey = 'search_history';
const historyQuery = 'search_query';

class SearchPage extends Component {
  constructor() {
    super();

    // get search history from localstorage
    const history = getStorageByKey(historyKey, 'local');

    // get search query from sessionStorage
    const query = getStorageByKey(historyQuery);

    this.state = {
      searchHistory: history || [],
      query: query
    };
  }

  componentDidMount() {
    this.autoFocusInst.focus();
  }

  // search input submit event
  handleSubmit = val => {
    if (val) {
      let query = {
        title: val
      };
      // set value to localStorge
      let searchHistory = getStorageByKey(historyKey, 'local');
      if (searchHistory) {
        // max length is 7
        if (searchHistory.length > 7) {
          searchHistory.pop();
        }
        // add history
        if (!searchHistory.includes(val)) {
          searchHistory.push(val);
        }
      } else {
        searchHistory = [val];
      }

      // set history to localStorage
      setStorageByKey(historyKey, searchHistory, 'local');
      // set query to sessionStorage
      setStorageByKey(historyQuery, query);
      // go index
      this.props.history.replace('/');
    } else {
      this.handleCancel();
    }
  };

  // search input cancel event
  handleCancel = () => {
    this.props.history.replace('/');
  };

  // search input clear event
  handleClear = () => {
    window.sessionStorage.removeItem(historyQuery);
  };

  // delete search history
  removeHistory = () => {
    window.localStorage.removeItem(historyKey);
    window.sessionStorage.removeItem(historyQuery);
    this.setState({
      searchHistory: [],
      query: null
    });
    this.autoFocusInst.focus();
  };

  // history item click
  historyClick(value) {
    this.handleSubmit(value);
  }

  render() {
    const { searchHistory, query } = this.state;
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
                  onClick={e => this.historyClick(item)}
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

export default SearchPage;
