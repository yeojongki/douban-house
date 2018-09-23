import React, { Component } from 'react';
import { SearchBar } from 'antd-mobile';
import SvgIcon from 'comp/SvgIcon';

// localstorage search key
const historyKey = 'search_history';

class SearchPage extends Component {
  constructor() {
    super();
    this.state = {
      searchHistory: []
    };
    // get search history from localstorage
    const history = window.localStorage.getItem(historyKey);
    if (history) {
      this.state.searchHistory = JSON.parse(history);
    }
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
      // set query to sessionStorage
      window.sessionStorage.setItem('search_query', JSON.stringify(query));
      this.props.history.replace('/');
    } else {
      this.handleCancel();
    }
  };

  // search input cancel event
  handleCancel = () => {
    window.sessionStorage.removeItem('search_query');
    this.props.history.replace('/');
  };

  // delete search history
  removeHistory = () => {
    localStorage.removeItem(historyKey);
    this.setState({
      searchHistory: []
    });
  };

  render() {
    const { searchHistory } = this.state;
    return (
      <div className="search">
        <SearchBar
          placeholder="请输入地铁、户型、价格等"
          showCancelButton={true}
          maxLength={20}
          ref={ref => (this.autoFocusInst = ref)}
          onSubmit={val => this.handleSubmit(val)}
          onCancel={this.handleCancel}
          onClear={() => console.log('clear')}
        />
        {searchHistory.length ? (
          <div className="search-history">
            <div className="search-history-title">
              <p>搜索历史</p>
            </div>
            <div className="search-history-item">
              {searchHistory.map((item, index) => (
                <div className="item flexbox ac" key={index}>
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
