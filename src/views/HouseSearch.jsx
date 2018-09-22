import React, { Component } from 'react';
import SearchBar from 'comp/SearchBar';

class SearchPage extends Component {
  handleTyping = val => {
    console.log(val);
  };

  render() {
    const { history } = this.props;
    return (
      <SearchBar
        typing={this.handleTyping}
        onCancel={history.goBack}
        onBlur={history.goBack}
      />
    );
  }
}

export default SearchPage;
