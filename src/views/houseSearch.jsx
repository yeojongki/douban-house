import React from 'react';
import SearchBar from 'comp/searchBar';

export default props => {
  function handleTyping(val) {
    console.log(val);
  }
  return <SearchBar typing={handleTyping} />;
};
