import React from 'react';
import SearchBar from 'comp/SearchBar';

export default props => {
  function handleTyping(val) {
    console.log(val);
  }
  return <SearchBar typing={handleTyping} />;
};
